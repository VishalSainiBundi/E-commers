"use client";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { FaChevronRight, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { changeQuantity, emptyCart, removeFromCart } from "@/redux/reduceres/cartReducer";
import { notify, toLocalPrice } from "@/helper/helper";
import { useRouter } from "next/navigation";

export default function Page() {
  const cart = useSelector((store) => store.cart);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.data.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Your Cart is Empty
                </h2>
                <p className="text-slate-500">
                  Add products to your cart to proceed to checkout.
                </p>
              </div>
            ) : (
              cart.data.map((item) => (
                <CartItem key={item.id} {...item} />
              ))
            )}
          </div>

          {/* Order Summary */}
          <OrderSummary
            final_total={cart.final_total}          
            original_total={cart.original_total}    
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Breadcrumb ---------------- */

function Breadcrumb() {
  return (
    <div className="flex items-center text-sm text-slate-600">
      <span className="hover:text-teal-600 cursor-pointer">Home</span>
      <FaChevronRight className="mx-3 text-xs" />
      <span className="hover:text-teal-600 cursor-pointer">Pages</span>
      <FaChevronRight className="mx-3 text-xs" />
      <span className="text-teal-600 font-semibold">Cart</span>
    </div>
  );
}

/* ---------------- Cart Item ---------------- */

function CartItem({ id, imgUrl, name, final_price, original_price, qty }) {
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

        <p className="text-slate-600 mt-2">
          {toLocalPrice(final_price)} × {qty}   {/* FIX */}
        </p>

        <p className="text-xl font-bold text-teal-600 mt-1">
          {toLocalPrice(final_price * qty)}
        </p>

        <QuantityControl
          id={id}
          quantity={qty}
          final_price={final_price}
          original_price={original_price}
        />
      </div>

      <button
        onClick={() =>
          dispatch(removeFromCart({ id, final_price, original_price, qty }))
        }
        className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition"
      >
        <FaTimes className="text-red-600" />
      </button>
    </div>
  );
}

/* ---------------- Quantity Control ---------------- */

function QuantityControl({ id, quantity, final_price, original_price }) {
  const dispatch = useDispatch();

  return (
    <div className="mt-4 flex items-center gap-4 border rounded-xl px-4 py-2 bg-slate-50 w-max">
      <button
        onClick={() =>
          dispatch(changeQuantity({ id, final_price, original_price, flag: 0 }))
        }
      >
        <FaMinus className="text-slate-600" />
      </button>

      <span className="font-semibold">{quantity}</span>

      <button
        onClick={() =>
          dispatch(changeQuantity({ id, final_price, original_price, flag: 1 }))
        }
      >
        <FaPlus className="text-slate-600" />
      </button>
    </div>
  );
}

/* ---------------- Order Summary ---------------- */

function OrderSummary({ final_total, original_total }) {
  const router = useRouter();
  const user = useSelector((store) => store.user);
  const cart = useSelector((store) => store.cart);
  const dispatch = useDispatch();

  const checkoutHandler = () => {
    if (!cart.data.length) {
      notify("Add item in this cart", 1); // ✅ fixed call
      return; // 🔥 stop redirect
    }

    router.push(
      user?.data
        ? "/checkout"
        : "/user-auth?redirect=/checkout"
    );
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 sticky top-[170px]">
        <h3 className="font-bold text-2xl mb-6 text-slate-800">
          Order Summary
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">
              {toLocalPrice(original_total)}   {/* FIX */}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Discount</span>
            <span className="font-semibold text-green-600">
              {toLocalPrice(original_total - final_total)} {/* FIX */}
            </span>
          </div>

          <div className="border-t-2 border-slate-200 pt-4 flex justify-between">
            <span className="font-bold text-slate-800">Total</span>
            <span className="text-2xl font-bold text-teal-600">
              {toLocalPrice(final_total)} {/* FIX */}
            </span>
          </div>
        </div>

        <button
          // ✅ removed disabled so notify works
          onClick={checkoutHandler}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition"
        >
          PROCEED TO CHECKOUT
        </button>

        <button
          onClick={() => dispatch(emptyCart())}
          className="mt-4 w-full border border-slate-300 text-slate-600 py-3 rounded-xl hover:bg-slate-100 transition"
        >
          Empty Cart
        </button>
      </div>
    </div>
  );
}
