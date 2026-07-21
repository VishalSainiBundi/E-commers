const nodemailer = require("nodemailer");
const userModel  = require("../model/userModel");
const Cryptr     = require("cryptr");
const cryptr     = new Cryptr(process.env.SECRETKEY);
const { createToken } = require("../helper/helper");

// ── Nodemailer transporter ────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Gmail App Password
  },
});

// ── Constants ─────────────────────────────────────────────────────────────────
const OTP_EXPIRY_MS     = 10 * 60 * 1000;   // 10 minutes
const OTP_RATE_LIMIT_MS =  60 * 1000;        //  1 request per 60 s

const generate6 = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ── Shared email helper ───────────────────────────────────────────────────────
const sendOtpEmail = async (to, otp, action) => {
  const label = action === "register" ? "new account" : "login";
  await transporter.sendMail({
    from: `"ISHOP" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your ISHOP verification code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;
                  padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#0d9488;margin-bottom:8px;">ISHOP Verification</h2>
        <p style="color:#475569;margin-bottom:24px;">
          Use the code below to verify your ${label}.
          It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background:#f1f5f9;border-radius:8px;padding:20px;
                    text-align:center;letter-spacing:0.3em;
                    font-size:36px;font-weight:700;color:#1e293b;">
          ${otp}
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>`,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /user/send-otp
// Body: { email, password, name? }
//   • Registration (name present) → create user (isVerified:false) + send OTP
//                                   → return { flag:0, token, isVerified:false }
//   • Login  (no name)            → validate creds + send OTP
//                                   → return { flag:0 }  (token comes after verify)
// ─────────────────────────────────────────────────────────────────────────────
const sendOtp = async (req, res) => {
  try {
    const email      = req.body.email?.trim().toLowerCase();
    const { password, name } = req.body;
    const isRegister = Boolean(name?.trim());

    // ── input validation ───────────────────────────────────────────────────
    if (!email || !password)
      return res.status(400).send({ msg: "Email and password are required", flag: 1 });
    if (password.length < 6)
      return res.status(400).send({ msg: "Password must be at least 6 characters", flag: 1 });
    if (isRegister && !name.trim())
      return res.status(400).send({ msg: "Name is required for registration", flag: 1 });

    let user = await userModel.findOne({ email });

    // ── credential / existence check ───────────────────────────────────────
    if (isRegister) {
      if (user)
        return res.send({ msg: "An account with this email already exists", flag: 1 });
    } else {
      if (!user)
        return res.send({ msg: "Account does not exist", flag: 1 });
      const decrypted = cryptr.decrypt(user.password);
      if (decrypted !== password)
        return res.send({ msg: "Incorrect password", flag: 1 });
    }

    // ── rate limiting ──────────────────────────────────────────────────────
    const rateTarget = user || { otpRequestedAt: null };
    if (
      rateTarget.otpRequestedAt &&
      Date.now() - new Date(rateTarget.otpRequestedAt).getTime() < OTP_RATE_LIMIT_MS
    ) {
      const secondsLeft = Math.ceil(
        (OTP_RATE_LIMIT_MS -
          (Date.now() - new Date(rateTarget.otpRequestedAt).getTime())) /
          1000
      );
      return res.status(429).send({
        msg: `Please wait ${secondsLeft}s before requesting another OTP`,
        flag: 1,
        secondsLeft,
      });
    }

    // ── generate OTP ───────────────────────────────────────────────────────
    const otp            = generate6();
    const otpExpiry      = new Date(Date.now() + OTP_EXPIRY_MS);
    const otpRequestedAt = new Date();

    if (isRegister) {
      // Create the user record (unverified) so we can attach an OTP to it
      const encryptedPass = cryptr.encrypt(password);
      user = await userModel.create({
        name:  name.trim(),
        email,
        password: encryptedPass,
        isVerified: false,
        otp,
        otpExpiry,
        otpRequestedAt,
      });

      // Issue a provisional token (isVerified:false) so the frontend can
      // call /verify-otp without sending credentials again.
      const token = createToken({ _id: user._id, email, isVerified: false });

      await sendOtpEmail(email, otp, "register");

      return res.send({
        msg: `Verification code sent to ${email}`,
        flag: 0,
        token,
        isVerified: false,
      });

    } else {
      // Login: just update OTP fields; token comes after /verify-otp
      await userModel.findByIdAndUpdate(user._id, { otp, otpExpiry, otpRequestedAt });
      await sendOtpEmail(email, otp, "login");

      return res.send({ msg: `Verification code sent to ${email}`, flag: 0 });
    }

  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("sendOtp:", error);
    return res.status(500).send({ msg: "Failed to send OTP. Please try again.", flag: 1 });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /user/verify-otp
// Body: { email, otp }
// On success → sets isVerified:true, clears OTP, returns { flag:0, user, token }
// ─────────────────────────────────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { otp } = req.body;

    if (!email || !otp)
      return res.status(400).send({ msg: "Email and OTP are required", flag: 1 });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.send({ msg: "Account not found", flag: 1 });

    // ── OTP match ──────────────────────────────────────────────────────────
    if (!user.otp || user.otp !== otp.trim())
      return res.send({ msg: "Invalid OTP. Please check and try again.", flag: 1 });

    // ── expiry ─────────────────────────────────────────────────────────────
    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      await userModel.findByIdAndUpdate(user._id, {
        otp: null, otpExpiry: null, otpRequestedAt: null,
      });
      return res.send({ msg: "OTP has expired. Please request a new one.", flag: 1 });
    }

    // ── success: verify user + clear OTP ──────────────────────────────────
    await userModel.findByIdAndUpdate(user._id, {
      isVerified:    true,
      otp:           null,
      otpExpiry:     null,
      otpRequestedAt:null,
    });

    const freshUser = await userModel.findById(user._id).lean();
    const token     = createToken({ ...freshUser, password: null });

    return res.send({
      msg:        "Verification successful",
      flag:       0,
      isVerified: true,
      user:       { ...freshUser, password: null },
      token,
    });

  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("verifyOtp:", error);
    return res.status(500).send({ msg: "Something went wrong. Please try again.", flag: 1 });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /user/resend-otp
// Auth: requires valid JWT (provisional or full) in Authorization header
// Body: { email }
// Re-generates OTP and resends email without requiring the password again.
// Used by the /verify-otp page for registered-but-unverified users.
// ─────────────────────────────────────────────────────────────────────────────
const resendOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email)
      return res.status(400).send({ msg: "Email is required", flag: 1 });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.send({ msg: "Account not found", flag: 1 });

    // Rate limiting
    if (
      user.otpRequestedAt &&
      Date.now() - new Date(user.otpRequestedAt).getTime() < OTP_RATE_LIMIT_MS
    ) {
      const secondsLeft = Math.ceil(
        (OTP_RATE_LIMIT_MS - (Date.now() - new Date(user.otpRequestedAt).getTime())) / 1000
      );
      return res.status(429).send({
        msg: `Please wait ${secondsLeft}s before requesting another OTP`,
        flag: 1,
        secondsLeft,
      });
    }

    const otp            = generate6();
    const otpExpiry      = new Date(Date.now() + OTP_EXPIRY_MS);
    const otpRequestedAt = new Date();

    await userModel.findByIdAndUpdate(user._id, { otp, otpExpiry, otpRequestedAt });
    await sendOtpEmail(email, otp, user.isVerified ? "login" : "register");

    return res.send({ msg: `Verification code resent to ${email}`, flag: 0 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("resendOtp:", error);
    return res.status(500).send({ msg: "Failed to resend OTP. Please try again.", flag: 1 });
  }
};

module.exports = { sendOtp, verifyOtp, resendOtp };
