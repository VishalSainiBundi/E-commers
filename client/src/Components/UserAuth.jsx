"use client";

import { axiosApiInstrector, notify } from "@/helper/helper";
import { setData } from "@/redux/reduceres/userReducer";
import { setCart } from "@/redux/reduceres/cartReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useDispatch } from "react-redux";

const API_IMAGE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "https://e-commers-tj4b.onrender.com/") +
  "img/product/main-image/";

const RESEND_COOLDOWN = 60;

const readLocalItems = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(parsed?.data) ? parsed.data : Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

export default function UserAuth() {
  const searchParams = useSearchParams();
  const dispatch     = useDispatch();
  const router       = useRouter();

  // "form" | "otp"
  const [view,         setView]         = useState("form");
  const [isLogin,      setIsLogin]      = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [formValues,   setFormValues]   = useState({ name: "", email: "", password: "" });

  // OTP state
  const [otp,        setOtp]        = useState(["", "", "", "", "", ""]);
  const [otpError,   setOtpError]   = useState("");
  const [cooldown,   setCooldown]   = useState(0);
  const cooldownRef   = useRef(null);
  const otpInputRefs  = useRef([]);

  const startCooldown = (seconds = RESEND_COOLDOWN) => {
    setCooldown(seconds);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const syncAfterLogin = async (user, token) => {
    const cart     = readLocalItems("cart");
    const wishlist = readLocalItems("wish");
    const headers  = { authorization: token };
    const [cartResult] = await Promise.all([
      axiosApiInstrector.post("/cart/sync-cart",       { user_id: user._id, cart_data: cart },     { headers }),
      axiosApiInstrector.post("/wish/sync-wishlist",   { user_id: user._id, cart_data: wishlist }, { headers }),
    ]);
    if (cartResult.data.flag === 0) {
      const syncedCart = (cartResult.data.finalCart || [])
        .filter((i) => i.product_id)
        .map((i) => ({
          id:             i.product_id._id || i.product_id.id,
          name:           i.product_id.name,
          qty:            i.quantity,
          imgUrl:         API_IMAGE_URL + i.product_id.thumbnail,
          original_price: Number(i.product_id.original_price) || 0,
          final_price:    Number(i.product_id.final_price)    || 0,
        }));
      dispatch(setCart(syncedCart));
    }
  };

  // ── STEP 1: Submit credentials ────────────────────────────────────────────
  const submitHandler = async (event) => {
    event.preventDefault();
    const form     = event.currentTarget;
    const email    = form.email.value.trim();
    const password = form.password.value;
    const name     = !isLogin ? form.name.value.trim() : "";

    if (!isLogin && password !== form.confirmPassword.value)
      return notify("Passwords do not match", 1);

    setFormValues({ name, email, password });
    setSubmitting(true);

    try {
      const response = await axiosApiInstrector.post("/user/send-otp", {
        email,
        password,
        ...(name && { name }),
      });

      if (response.data.flag !== 0) {
        notify(response.data.msg, 1);
        return;
      }

      // ── REGISTER path: backend already created user + issued provisional token ──
      if (!isLogin && response.data.token) {
        dispatch(setData({
          user:       { email, name },  // minimal placeholder — full user comes after verify
          token:      response.data.token,
          isVerified: false,
        }));
        notify("Account created! Please verify your email.", 0);
        router.push("/verify-otp");
        return;
      }

      // ── LOGIN path: show OTP input in the same page ───────────────────────
      notify(`OTP sent to ${email}`, 0);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setView("otp");
      startCooldown(RESEND_COOLDOWN);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);

    } catch (err) {
      notify(err?.response?.data?.msg || "Failed to send OTP. Try again.", 1);
    } finally {
      setSubmitting(false);
    }
  };

  // ── STEP 2 (login only): verify OTP in-page ───────────────────────────────
  const verifyOtpHandler = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setOtpError("Please enter the complete 6-digit code."); return; }
    setOtpError("");
    setSubmitting(true);
    try {
      const response = await axiosApiInstrector.post("/user/verify-otp", {
        email: formValues.email,
        otp:   code,
      });
      if (response.data.flag !== 0) { setOtpError(response.data.msg || "Invalid or expired OTP."); return; }

      dispatch(setData({
        user:       response.data.user,
        token:      response.data.token,
        isVerified: true,
      }));
      try { await syncAfterLogin(response.data.user, response.data.token); } catch { /* non-fatal */ }
      notify("Logged in successfully!", 0);
      router.push(searchParams.get("redirect") || "/");
    } catch (err) {
      setOtpError(err?.response?.data?.msg || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    setSubmitting(true);
    try {
      const response = await axiosApiInstrector.post("/user/send-otp", {
        email:    formValues.email,
        password: formValues.password,
        ...(formValues.name && { name: formValues.name }),
      });
      if (response.data.flag !== 0) {
        if (response.data.secondsLeft) startCooldown(response.data.secondsLeft);
        notify(response.data.msg, 1);
        return;
      }
      notify("New OTP sent!", 0);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      startCooldown(RESEND_COOLDOWN);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      notify(err?.response?.data?.msg || "Could not resend OTP.", 1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (i, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[i] = value.slice(-1);
    setOtp(updated);
    setOtpError("");
    if (value && i < 5) otpInputRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpInputRefs.current[i - 1]?.focus();
    if (e.key === "Enter") verifyOtpHandler();
  };
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); otpInputRefs.current[5]?.focus(); }
    e.preventDefault();
  };

  // ── OTP screen (login only) ───────────────────────────────────────────────
  if (view === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4">
              <FiShield className="text-teal-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verify your email</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-gray-700">{formValues.email}</span>
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-2" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpInputRefs.current[i] = el)}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                  ${digit ? "border-teal-500 bg-teal-50" : "border-gray-300"}
                  ${otpError ? "border-red-400 bg-red-50" : ""}
                  focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
              />
            ))}
          </div>

          {otpError && <p className="text-center text-sm text-red-500 mt-2 mb-2">{otpError}</p>}

          <button
            onClick={verifyOtpHandler}
            disabled={submitting || otp.join("").length !== 6}
            className="w-full mt-5 bg-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
          >
            {submitting ? "Verifying..." : "Verify & Sign In"}
          </button>

          <div className="text-center mt-4">
            {cooldown > 0
              ? <p className="text-sm text-gray-500">Resend in <span className="font-semibold text-teal-600">{cooldown}s</span></p>
              : <button onClick={resendOtp} disabled={submitting} className="text-sm text-teal-600 font-semibold hover:underline disabled:opacity-50">Resend OTP</button>
            }
          </div>
          <div className="text-center mt-3">
            <button
              onClick={() => { setView("form"); setOtp(["","","","","",""]); setOtpError(""); }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >← Change email / password</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Credentials form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6">
          <img src="/img/login.png" alt="auth illustration" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="flex bg-gray-200 rounded-lg mb-6">
            <button type="button" onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-lg font-semibold transition ${!isLogin ? "bg-teal-500 text-white" : "text-gray-600"}`}>
              Sign Up
            </button>
            <button type="button" onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-lg font-semibold transition ${isLogin ? "bg-teal-500 text-white" : "text-gray-600"}`}>
              Sign In
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-center text-gray-500 mb-6 text-sm">{isLogin ? "Sign in to continue" : "Join us today"}</p>

          <form className="space-y-4" onSubmit={submitHandler}>
            {!isLogin && (
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input name="name" type="text" placeholder="Full Name" required defaultValue={formValues.name}
                  className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
            )}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input name="email" type="email" placeholder="Email" required defaultValue={formValues.email}
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input name="password" type={showPassword ? "text" : "password"} minLength={6}
                placeholder="Password" required defaultValue={formValues.password}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
              <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-3 text-gray-400">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input name="confirmPassword" type="password" minLength={6} placeholder="Confirm Password" required
                  className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
            )}
            <button type="submit" disabled={submitting}
              className="w-full bg-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition">
              {submitting ? "Sending OTP..." : isLogin ? "Continue →" : "Register →"}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            {isLogin ? "A one-time code will be sent to your email to confirm your identity."
                     : "We'll send a verification code to confirm your email address."}
          </p>
        </div>
      </div>
    </div>
  );
}
