"use client";

import { axiosApiInstrector, notify } from "@/helper/helper";
import { setData } from "@/redux/reduceres/userReducer";
import { setCart } from "@/redux/reduceres/cartReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";

const imageUrl = "http://localhost:5000/img/product/main-image/";

const readLocalItems = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(parsed?.data) ? parsed.data : Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function UserAuth() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const syncAfterLogin = async (user, token) => {
    const cart = readLocalItems("cart");
    const wishlist = readLocalItems("wish");
    const headers = { authorization: token };
    const [cartResult] = await Promise.all([
      axiosApiInstrector.post("/cart/sync-cart", { user_id: user._id, cart_data: cart }, { headers }),
      axiosApiInstrector.post("/wish/sync-wishlist", { user_id: user._id, cart_data: wishlist }, { headers }),
    ]);

    if (cartResult.data.flag === 0) {
      const syncedCart = (cartResult.data.finalCart || []).filter((item) => item.product_id).map((item) => ({
        id: item.product_id._id || item.product_id.id,
        name: item.product_id.name,
        qty: item.quantity,
        imgUrl: imageUrl + item.product_id.thumbnail,
        original_price: Number(item.product_id.original_price) || 0,
        final_price: Number(item.product_id.final_price) || 0,
      }));
      dispatch(setCart(syncedCart));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!isLogin) {
      const name = form.name.value.trim();
      if (password !== form.confirmPassword.value) return notify("Passwords do not match", 1);
      setSubmitting(true);
      try {
        const response = await axiosApiInstrector.post("/user/register", { name, email, password });
        notify(response.data.msg, response.data.flag);
        if (response.data.flag === 0) {
          form.reset();
          setIsLogin(true);
        }
      } catch (error) {
        notify(error.response?.data?.msg || "Could not create account", 1);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosApiInstrector.post("/user/login", { email, password });
      if (response.data.flag !== 0) return notify(response.data.msg, 1);
      dispatch(setData({ user: response.data.user, token: response.data.token }));
      try {
        await syncAfterLogin(response.data.user, response.data.token);
      } catch (error) {
        notify("Logged in, but cart sync failed. Please try again.", 1);
      }
      notify(response.data.msg, 0);
      router.push(searchParams.get("redirect") || "/");
    } catch (error) {
      notify(error.response?.data?.msg || "Login failed", 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6"><img src="/img/login.png" alt="auth" /></div>
        <div className="w-full md:w-1/2 p-8">
          <div className="flex bg-gray-200 rounded-lg mb-6">
            <button type="button" onClick={() => setIsLogin(false)} className={`w-1/2 py-2 rounded-lg font-semibold ${!isLogin ? "bg-teal-500 text-white" : "text-gray-600"}`}>Sign Up</button>
            <button type="button" onClick={() => setIsLogin(true)} className={`w-1/2 py-2 rounded-lg font-semibold ${isLogin ? "bg-teal-500 text-white" : "text-gray-600"}`}>Sign In</button>
          </div>
          <h2 className="text-2xl font-bold text-center">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-center text-gray-500 mb-6 text-sm">{isLogin ? "Sign in to continue" : "Join us today"}</p>
          <form className="space-y-4" onSubmit={submitHandler}>
            {!isLogin && <div className="relative"><FiUser className="absolute left-3 top-3 text-gray-400" /><input name="name" type="text" placeholder="Full Name" required className="w-full pl-10 py-2 border rounded-lg" /></div>}
            <div className="relative"><FiMail className="absolute left-3 top-3 text-gray-400" /><input name="email" type="email" placeholder="Email" required className="w-full pl-10 py-2 border rounded-lg" /></div>
            <div className="relative"><FiLock className="absolute left-3 top-3 text-gray-400" /><input name="password" type={showPassword ? "text" : "password"} minLength="6" placeholder="Password" required className="w-full pl-10 pr-10 py-2 border rounded-lg" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
            {!isLogin && <div className="relative"><FiLock className="absolute left-3 top-3 text-gray-400" /><input name="confirmPassword" type="password" minLength="6" placeholder="Confirm Password" required className="w-full pl-10 py-2 border rounded-lg" /></div>}
            <button disabled={submitting} className="w-full bg-teal-500 disabled:bg-teal-300 text-white py-2 rounded-lg">{submitting ? "Please wait..." : isLogin ? "Sign In" : "Register"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
