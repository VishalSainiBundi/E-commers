const nodemailer = require("nodemailer");
const userModel = require("../model/userModel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRETKEY);
const { createToken } = require("../helper/helper");

// ── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use an App Password, not your Gmail password
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const generate6DigitOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const OTP_EXPIRY_MS = 5 * 60 * 1000;    // 5 minutes
const OTP_RATE_LIMIT_MS = 60 * 1000;    // 1 request per 60 seconds

// ── POST /user/send-otp ───────────────────────────────────────────────────────
// Body: { email, password, name? }
// Validates credentials first, then sends OTP.
// For registration: name is required.  For login: name is omitted.
const sendOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password, name } = req.body;
    const isRegister = Boolean(name);

    // ── Basic input validation ─────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).send({ msg: "Email and password are required", flag: 1 });
    }
    if (isRegister && !name?.trim()) {
      return res.status(400).send({ msg: "Name is required for registration", flag: 1 });
    }
    if (password.length < 6) {
      return res.status(400).send({ msg: "Password must be at least 6 characters", flag: 1 });
    }

    // ── Credential check ──────────────────────────────────────────────────
    const existing = await userModel.findOne({ email });

    if (isRegister) {
      // For sign-up: email must NOT already exist
      if (existing) {
        return res.send({ msg: "An account with this email already exists", flag: 1 });
      }
    } else {
      // For login: email must exist AND password must match
      if (!existing) {
        return res.send({ msg: "Account does not exist", flag: 1 });
      }
      const decrypted = cryptr.decrypt(existing.password);
      if (decrypted !== password) {
        return res.send({ msg: "Incorrect password", flag: 1 });
      }
    }

    // ── Rate limiting: one OTP per 60 seconds ─────────────────────────────
    const target = existing || { otpRequestedAt: null };
    if (
      target.otpRequestedAt &&
      Date.now() - new Date(target.otpRequestedAt).getTime() < OTP_RATE_LIMIT_MS
    ) {
      const secondsLeft = Math.ceil(
        (OTP_RATE_LIMIT_MS - (Date.now() - new Date(target.otpRequestedAt).getTime())) / 1000
      );
      return res.status(429).send({
        msg: `Please wait ${secondsLeft} seconds before requesting another OTP`,
        flag: 1,
        secondsLeft,
      });
    }

    // ── Generate and persist OTP ──────────────────────────────────────────
    const otp = generate6DigitOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
    const otpRequestedAt = new Date();

    if (existing) {
      await userModel.findByIdAndUpdate(existing._id, {
        otp,
        otpExpiry,
        otpRequestedAt,
      });
    } else {
      // For registration we store otp on a temp doc keyed by email.
      // We create the user record now (unverified) so we can attach OTP to it.
      const encryptedPass = cryptr.encrypt(password);
      const newUser = await userModel.create({
        name: name.trim(),
        email,
        password: encryptedPass,
        otp,
        otpExpiry,
        otpRequestedAt,
      });
      // Needed for rate-limit check on resend
    }

    // ── Send email ────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"ISHOP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your ISHOP verification code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
          <h2 style="color:#0d9488;margin-bottom:8px;">ISHOP Verification</h2>
          <p style="color:#475569;margin-bottom:24px;">Use the code below to verify your ${isRegister ? "new account" : "login"}. It expires in <strong>5 minutes</strong>.</p>
          <div style="background:#f1f5f9;border-radius:8px;padding:20px;text-align:center;letter-spacing:0.3em;font-size:36px;font-weight:700;color:#1e293b;">${otp}</div>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.send({
      msg: `OTP sent to ${email}`,
      flag: 0,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("sendOtp error:", error);
    return res.status(500).send({ msg: "Failed to send OTP. Please try again.", flag: 1 });
  }
};

// ── POST /user/verify-otp ─────────────────────────────────────────────────────
// Body: { email, otp }
// On success: returns { flag: 0, user, token }
const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ msg: "Email and OTP are required", flag: 1 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({ msg: "Account not found", flag: 1 });
    }

    // ── Check OTP ─────────────────────────────────────────────────────────
    if (!user.otp || user.otp !== otp.trim()) {
      return res.send({ msg: "Invalid OTP. Please check and try again.", flag: 1 });
    }

    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      // Clear expired OTP
      await userModel.findByIdAndUpdate(user._id, {
        otp: null,
        otpExpiry: null,
        otpRequestedAt: null,
      });
      return res.send({ msg: "OTP has expired. Please request a new one.", flag: 1 });
    }

    // ── OTP valid — clear it and issue JWT ────────────────────────────────
    await userModel.findByIdAndUpdate(user._id, {
      otp: null,
      otpExpiry: null,
      otpRequestedAt: null,
    });

    const freshUser = await userModel.findById(user._id).lean();
    const token = createToken({ ...freshUser, password: null });

    return res.send({
      msg: "Verification successful",
      flag: 0,
      user: { ...freshUser, password: null },
      token,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("verifyOtp error:", error);
    return res.status(500).send({ msg: "Something went wrong. Please try again.", flag: 1 });
  }
};

module.exports = { sendOtp, verifyOtp };
