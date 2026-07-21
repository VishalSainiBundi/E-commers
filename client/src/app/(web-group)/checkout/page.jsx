"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";
import { FaChevronRight, FaCheckCircle, FaTruck, FaCreditCard } from "react-icons/fa";
import Link from "next/link";
import { emptyCart } from "@/redux/reduceres/cartReducer";
import { axiosApiInstrector, toLocalPrice } from "@/helper/helper";

export default function CheckoutPage() {
  const { Razorpay, isLoading: isRazorpayLoading, error: razorpayError } = useRazorpay();
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((store) => store.cart);
  const user = useSelector((store) => store.user);

  const [paymentMode, setPaymentMode] = useState(1); // 0: COD, 1: Online
  const [currentAddress, setCurrentAddress] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (user?.data?.default_address !== undefined) {
      setCurrentAddress(user.data.default_address);
    }
  }, [user]);

  const orderPlaceHandler = async () => {
  if (!user?.token) {
    alert("Please login first!");
    return;
  }

  if (!cart?.data || cart.data.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const extraShipping = paymentMode === 0 ? 49 : 0;
  const totalAmount = (cart?.final_total || 0) + extraShipping;

  try {
    // 🔥 FIX: Map cart → backend format
   const productDetails = cart.data.map((item) => {
  if (!item._id) throw new Error("Cart item _id missing");

  return {
    id: item._id, // ✅ backend requires this
    name: item.name,
    qty: item.qty,
    final_price: item.final_price,
    original_price: item.original_price,
    imgUrl: item.imgUrl,
  };
});
    // 🔥 FIX: Match schema exactly
    const shippingAddress =
      user?.data?.shipping_address?.[currentAddress] || {};

    const response = await axiosApiInstrector.post("/order", {
  userId: user?.data?._id,
  paymentMode,
  totalAmount,
  shippingAddress,
  productDetails, // ✅ SAME NAME (backend destructuring)
},
      {
        headers: { authorization: user?.token },
      }
    );

    if (response.data.flag === 0) {
      const { order_id, razorpay_order_id } = response.data;

      if (paymentMode === 0) {
        dispatch(emptyCart());
        router.push("/order-placed/" + order_id);
      } else {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
          amount: totalAmount * 100,
          currency: "INR",
          name: "ISHOP",
          order_id: razorpay_order_id,
          prefill: {
            name: user?.data?.name,
            email: user?.data?.email,
          },
          theme: { color: "#00bba7" },
          handler: async function (response) {
            try {
              const verify = await axiosApiInstrector.post(
                "/order/verify-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id,
                },
                { headers: { authorization: user.token } }
              );

              if (verify.data.flag === 0) {
                dispatch(emptyCart());
                router.push("/order-placed/" + order_id);
              } else {
                alert("Payment verification failed!");
              }
            } catch (err) {
              if (process.env.NODE_ENV !== "production") console.error(err);
              alert("Payment verification error");
            }
          },
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
      }
    } else {
      alert(response.data.msg);
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    alert("Something went wrong while placing order");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <FaTruck className="text-teal-500 text-xl" />
                <h2 className="text-2xl font-bold text-slate-800">Shipping Address</h2>
              </div>

              {user?.data?.shipping_address?.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No shipping addresses found.</p>
              ) : (
                <div className="space-y-3">
                  {user?.data?.shipping_address?.map((address, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        idx === currentAddress
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                      onClick={() => setCurrentAddress(idx)}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          checked={idx === currentAddress}
                          readOnly
                          className="w-5 h-5 mt-1 cursor-pointer accent-teal-500"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-slate-800">{address.name}</p>
                            {idx === user?.data?.default_address && (
                              <span className="text-xs font-bold bg-teal-500 text-white px-3 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mt-2">
                            {address.addressLine1}, {address.addressLine2}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {address.city}, {address.state}, {address.country} {address.pincode}
                          </p>
                          <p className="text-slate-600 text-sm mt-2">📞 {address.contact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Mode */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <FaCreditCard className="text-teal-500 text-xl" />
                <h2 className="text-2xl font-bold text-slate-800">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[{ id: 0, label: "Cash on Delivery", desc: "Pay when you receive" },
                  { id: 1, label: "Pay Now", desc: "Secure online payment" }].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMode === method.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMode === method.id}
                      onChange={() => setPaymentMode(method.id)}
                      className="w-5 h-5 accent-teal-500 cursor-pointer"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-slate-800">{method.label}</p>
                      <p className="text-sm text-slate-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <OrderSummary
            final_total={cart?.final_total}
            original_total={cart?.original_total}
            paymentMode={paymentMode}
            orderPlaceHandler={orderPlaceHandler}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------- Breadcrumb ----------------
function Breadcrumb() {
  return (
    <div className="flex items-center text-sm text-slate-600">
      <span className="hover:text-teal-600 cursor-pointer">Home</span>
      <FaChevronRight className="mx-3 text-xs" />
      <span className="hover:text-teal-600 cursor-pointer">Pages</span>
      <FaChevronRight className="mx-3 text-xs" />
      <span className="text-teal-600 font-semibold">Checkout</span>
    </div>
  );
}

// ---------------- Order Summary ----------------
function OrderSummary({ final_total, original_total, paymentMode, orderPlaceHandler }) {
  const extra = paymentMode === 0 ? 49 : 0;
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 sticky top-[170px]">
        <h3 className="font-bold text-2xl mb-6 text-slate-800">Order Summary</h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">{toLocalPrice(original_total)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Discount</span>
            <span className="font-semibold text-green-600">
              -{toLocalPrice(original_total - final_total)}
            </span>
          </div>

          {paymentMode === 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Shipping Charges</span>
              <span className="font-semibold text-red-600">+{toLocalPrice(extra)}</span>
            </div>
          )}

          <div className="border-t-2 border-slate-200 pt-4 flex justify-between">
            <span className="font-bold text-slate-800">Total</span>
            <span className="text-2xl font-bold text-teal-600">{toLocalPrice(final_total + extra)}</span>
          </div>
        </div>

        <button
          onClick={orderPlaceHandler}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FaCheckCircle /> {paymentMode === 1 ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
        </button>

        <button className="mt-4 w-full border border-slate-300 text-slate-600 py-3 rounded-xl hover:bg-slate-100 transition">
          <Link href="/cart">Back to Cart</Link>
        </button>

        <p className="text-center text-xs text-slate-500 mt-4">✓ Secure & encrypted payment</p>
      </div>
    </div>
  );
}
