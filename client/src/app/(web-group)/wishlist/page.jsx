"use client";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { FaChevronRight, FaTimes } from "react-icons/fa";
import { toLocalPrice } from "@/helper/helper";
import { removeFromWishlist } from "@/redux/reduceres/wishlistReducer";
import AddToCartButton from "@/Components/website/AddToCartButton";
import Link from "next/link";

export default function Page() {
  const wish = useSelector((store) => store.wish);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {wish.data.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Your Wishlist is Empty
                </h2>
                <p className="text-slate-500">
                  Add products to your Wishlist
                </p>
              </div>
            ) : (
              wish.data.map((item) => (
                <CartItem key={item.id} {...item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Breadcrumb ---------------- */

function Breadcrumb() {
  return (
    <div className="flex items-center text-sm text-slate-600">
      <Link href="/">
        <span className="hover:text-teal-600 cursor-pointer">Home</span>
      </Link>

      <FaChevronRight className="mx-3 text-xs" />

      <Link href="/store">
        <span className="hover:text-teal-600 cursor-pointer">Store</span>
      </Link>

      <FaChevronRight className="mx-3 text-xs" />

      <Link href="/cart">
        <span className="font-semibold">Cart</span>
      </Link>

      <FaChevronRight className="mx-3 text-xs" />

      <span className="text-teal-600 font-semibold">Wishlist</span>
    </div>
  );
}

/* ---------------- Cart Item ---------------- */

function CartItem({ id, imgUrl, name, final_price, original_price, discount_persantage }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 flex gap-6">
      <img
        src={imgUrl}
        alt={name}
        className="w-28 h-28 object-cover rounded-xl"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 text-lg">{name}</h3>

        <h2 className="text-teal-700 text-md">Nice Your Choice</h2>

        <p className="text-xl font-bold text-teal-600 mt-1">
          {toLocalPrice(Number(final_price) || 0)}
        </p>

        {/* ✅ FIX: AddToCartButton now renders */}
        <AddToCartButton
          id={id}
          imgUrl={imgUrl}
          name={name}
          final_price={Number(final_price) || 0}
          original_price={Number(original_price) || 0}
          discount_persantage={original_price-final_price}
          removeFromWishlist
          
        />
      
      </div>

      {/* <button
        onClick={() => dispatch(removeFromWishlist({ id }))
      }
        className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition"
      >
        <FaTimes className="text-red-600" />
      </button> */}
    </div>
  );
}
