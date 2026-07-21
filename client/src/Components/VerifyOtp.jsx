"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FiShield } from "react-icons/fi";
import { axiosApiInstrector, notify } from "@/helper/helper";
import { setVerified } from "@/redux/reduceres/userReducer";
import { setCart } from "@/redux/reduceres/cartReducer";

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

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const router   = useRouter();
  const user     = useSelector((s) => s.user);

  const [otp,        setOtp]        = useState(["", "", "", "", "", ""]);
  const [otpError,   setOtpError]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown,   setCooldown]   = useState(0);
  const cooldownRef  = useRef(null);
  const otpInputRefs = useRef([]);

  // ── Redirect if already verified ──────────────────────────────────────────
  useEffect(() => {
    if (user?.isVerified) router.replace("/");
  }, [user?.isVerified, router]);

  // ── Auto-focus + start cooldown on mount ──────────────────────────────────
  useEffect(() => {
    setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    startCooldown(RESEND_COOLDOWN);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearInterval(cooldownRef.current), []);

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

  // ── Cart sync after verification ──────────────────────────────────────────
  const syncAfterVerify = async (freshUser, token) => {
    const cart     = readLocalItems("cart");
    const wishlist = readLocalItems("wish");
    const headers  = { authorization: token };
    const [cartResult] = await Promise.all([
      axiosApiInstrector.post("/cart/sync-cart",     { user_id: freshUser._id, cart_data: cart },     { headers }),
      axiosApiInstrector.post("/wish/sync-wishlist", { user_id: freshUser._id, cart_data: wishlist }, { headers }),
    ]);
    if (cartResult.data.flag === 0) {
      const synced = (cartResult.data.finalCart || [])
        .filter((i) => i.product_id)
        .map((i) => ({
          id:             i.product_id._id || i.product_id.id,
          name:           i.product_id.name,
          qty:            i.quantity,
          imgUrl:         API_IMAGE_URL + i.product_id.thumbnail,
          original_price: Number(i.product_id.original_price) || 0,
          final_price:    Number(i.product_id.final_price)    || 0,
        }));
      dispatch(setCart(synced));
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const verifyOtpHandler = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setOtpError("Please enter the complete 6-digit code."); return; }

    const email = user?.data?.email;
    if (!email) {
      notify("Session expired. Please register again.", 1);
      router.replace("/user-auth");
      return;
    }

    setOtpError("");
    setSubmitting(true);
    try {
      const response = await axiosApiInstrector.post(
        "/user/verify-otp",
        { email, otp: code },
        { headers: { authorization: user?.token } }
      );

      if (response.data.flag !== 0) {
        setOtpError(response.data.msg || "Invalid or expired OTP.");
        return;
      }

      dispatch(setVerified({ user: response.data.user, token: response.data.token }));
      try { await syncAfterVerify(response.data.user, response.data.token); } catch { /* non-fatal */ }

      notify("Email verified! Welcome to ISHOP 🎉", 0);
      router.replace("/");
    } catch (err) {
      setOtpError(err?.response?.data?.msg || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Resend OTP (token-authenticated, no password needed) ──────────────────
  const resendOtp = async () => {
    if (cooldown > 0 || !user?.data?.email) return;
    setSubmitting(true);
    try {
      const response = await axiosApiInstrector.post(
        "/user/resend-otp",
        { email: user.data.email },
        { headers: { authorization: user?.token } }
      );
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

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleOtpChange = (i, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp]; updated[i] = value.slice(-1); setOtp(updated); setOtpError("");
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

  // ── Render ────────────────────────────────────────────────────────────────
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
            <span className="font-semibold text-gray-700">{user?.data?.email || "your email"}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Code expires in 10 minutes</p>
        </div>

        {/* OTP boxes */}
        <div className="flex justify-center gap-3 mb-2" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (otpInputRefs.current[i] = el)}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                ${digit && !otpError ? "border-teal-500 bg-teal-50" : ""}
                ${otpError ? "border-red-400 bg-red-50" : "border-gray-300"}
                focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
            />
          ))}
        </div>

        {otpError && (
          <p className="text-center text-sm text-red-500 mt-2 mb-1">{otpError}</p>
        )}

        <button
          onClick={verifyOtpHandler}
          disabled={submitting || otp.join("").length !== 6}
          className="w-full mt-5 bg-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
        >
          {submitting ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="text-center mt-4">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in <span className="font-semibold text-teal-600">{cooldown}s</span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              disabled={submitting}
              className="text-sm text-teal-600 font-semibold hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="text-center mt-3 text-xs text-gray-400">
          Wrong account?{" "}
          <button
            onClick={() => router.replace("/user-auth")}
            className="text-teal-600 hover:underline"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
