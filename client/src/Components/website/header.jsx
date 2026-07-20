"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";
import { logout, lstouser } from "@/redux/reduceres/userReducer";
import { emptyCart, lsToCart } from "@/redux/reduceres/cartReducer";
import { toLocalPrice } from "@/helper/helper";
import { LogOut } from "lucide-react";
import { lsWishCart } from "@/redux/reduceres/wishlistReducer";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((store) => store.cart);
  const user = useSelector((state) => state.user.data);
  // console.log("USER",user)

  // Optional loading state to avoid null flash
  const [loading, setLoading] = useState(true);

  useEffect(() => {

const LoginAt=localStorage.getItem("loginAt")
if(LoginAt){
  const currentTime=Date.now();
  const timeDff=currentTime -parseInt(LoginAt,10);
  if(timeDff>=process.env.NEXT_PUBLIC_Exprin){
    dispatch(logout())
    dispatch(emptyCart())
  }
}

    // Load cart from localStorage
    dispatch(lsToCart());

    dispatch(lsWishCart())

    // Load user from localStorage
    dispatch(lstouser());

    setLoading(false);
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("user");
      dispatch({ type: "user/logout" });
      dispatch(emptyCart());
      router.push("/user-auth");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="w-full py-4 px-2">
      {/* Top info bar */}
      <div className="max-w-7xl flex mx-auto justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-black p-3 text-[12px] pl-3 bg-gray-200 rounded-xl">
            Hotline 24/7
          </h1>
          <span className="text-black">(025) 3886 25 16</span>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-black text-[14px] cursor-pointer">
            Sell on Swoo
          </span>
          <span className="text-black text-[14px] cursor-pointer">
            Order Tracking
          </span>

          <label htmlFor="country" className="text-black text-sm">
            USA
          </label>
          <select name="country" id="country" className="border rounded px-1">
            <option value="">Select</option>
            <option value="india">India</option>
            <option value="australia">Australia</option>
            <option value="usa">USA</option>
            <option value="germany">Germany</option>
          </select>

          <span className="flex gap-2 items-center">
            <img src="/img/logo.png" alt="logo" />
            <select name="language" id="language" className="border rounded px-1">
              <option value="eng">Eng</option>
              <option value="hin">Hin</option>
              <option value="fra">Fran</option>
              <option value="ger">Germ</option>
            </select>
          </span>
        </div>
      </div>

      {/* Middle navigation bar */}
      <div className="max-w-7xl flex mx-auto mt-4 justify-between items-center">
        <div className="flex items-center">
          <img className="mr-15" src="/img/logo1.png" alt="logo" />
          <ul className="flex text-[14px] font-medium gap-4 text-black">
            <Link href="/">Home</Link>
            <Link href="/store">Store</Link>
            <Link href="/contect">Contect</Link>
            <Link href="/about">About</Link>
            <Link href="/wishlist">Wishlist</Link>
          </ul>
        </div>

        <div className="flex items-center gap-5">
          <div className="mr-10 text-right">
            <div className="text-[15px] text-gray-600 font-medium">
              {loading ? "Loading..." : `Hello, ${user?.name || "Welcome"}`}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="px-2 py-1 text-sm text-white bg-teal-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/user-auth?redirect=/"
                className="font-bold text-[16px] text-teal-500 flex items-center gap-1 uppercase whitespace-nowrap"
              >
                <span>Log In /</span>
                <span>Register</span>
              </Link>
            )}
          </div>

          {/* Cart icon with count */}
          <div className="relative">
            <img src="/img/icons.png" alt="icons" className="w-16 h-16" />
            <Link href="/cart">
              <IoCartOutline
                size={30}
                className="absolute top-2 right-5 text-white bg-teal-600 rounded-full p-1"
              />
            </Link>
            <span className="absolute -top-1 right-2 min-w-[18px] h-[18px] flex items-center justify-center
                             text-[10px] font-bold text-white bg-red-500 rounded-full">
              {cart?.data?.length || 0}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center min-w-[3rem] h-8 px-2 text-xs font-semibold rounded-full shadow-sm">
            <span>{toLocalPrice(cart?.final_total)}</span>
            <del className="text-gray-500">{toLocalPrice(cart?.original_total)}</del>
          </div>
        </div>
      </div>

      {/* Bottom search bar */}
      <div className="max-w-7xl flex bg-[#01A49E] rounded-b-sm py-4 px-2 mx-auto mt-4 items-center">
        <div className="flex bg-white rounded-[30px] py-3 px-4 items-center w-full max-w-md">
          <select
            name="categories"
            id="categories"
            className="text-[13px] font-bold text-[#212529] border-none outline-none"
          >
            <option value="all">All Categories</option>
            <option value="kids">Kids</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <input
            type="text"
            placeholder="Search anything..."
            className="ml-2 flex-grow outline-none text-sm"
          />
          <img src="/img/search.png" alt="search" className="ml-4 w-5 h-5" />
        </div>

        <ul className="flex flex-1 text-white text-[13px] font-medium justify-around">
          <li>free shipping over $199</li>
          <li>30 days money back</li>
          <li>100% secure payment</li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
