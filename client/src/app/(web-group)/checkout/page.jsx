"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";
import { FaChevronRight, FaCheckCircle, FaTruck, FaCreditCard, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { emptyCart } from "@/redux/reduceres/cartReducer";
import { axiosApiInstrector, toLocalPrice, notify } from "@/helper/helper";

export default function CheckoutPage() {
  const { Razorpay, isLoading: isRazorpayLoading } = useRazorpay();
  const dispatch = useDispatch();
  const router   = useRouter();

  const cart = useSelector((store) => store.cart);
  const user = useSelector((store) => store.user);

  const [paymentMode,    setPaymentMode]    = useState(1); // 0: COD, 1: Online
  const [currentAddress, setCurrentAddress] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (user?.data?.default_address !== undefined) {
      setCurrentAddress(user.data.default_address);
    }
  }, [user]);

  const orderPlaceHandler = async () => {
    if (!user?.token) {
      notify("Please login first!", 1);
      router.push("/user-auth?redirect=/checkout");
      return;
    }
    if (!cart?.data || cart.data.length === 0) {
      notify("Your cart is empty!", 1);
      return;
    }
    const addresses = user?.data?.shipping_address || [];
    if (addresses.length === 0) {
      notify("Please add a shipping address before placing your order.", 1);
      return;
    }
    const selectedAddress = addresses[currentAddress];
    if (!selectedAddress?.addressLine1 || !selectedAddress?.city ||
        !selectedAddress?.state || !selectedAddress?.country || !selectedAddress?.pincode) {
      notify("Selected shipping address is incomplete. Please update it.", 1);
      return;
    }

    const extraShipping = paymentMode === 0 ? 49 : 0;
    const totalAmount   = (cart?.final_total || 0) + extraShipping;

    const productDetails = cart.data.map((item) => ({
      id:             item.id,
      name:           item.name,
      qty:            item.qty,
      final_price:    item.final_price,
      original_price: item.original_price,
      imgUrl:         item.imgUrl || "",
    }));

    const shippingAddress = {
      name:         selectedAddress.name || user?.data?.name || "",
      addressLine1: selectedAddress.addressLine1,
      addressLine2: selectedAddress.addressLine2 || "",
      city:         selectedAddress.city,
      state:        selectedAddress.state,
      country:      selectedAddress.country,
      pincode:      selectedAddress.pincode,
      contact:      selectedAddress.contact || "",
    };

    setIsPlacingOrder(true);
    try {
      const response = await axiosApiInstrector.post(
        "/order",
        { userId: user?.data?._id, paymentMode, totalAmount, shippingAddress, productDetails },
        { headers: { authorization: user?.token } }
      );

      if (response.data.flag === 0) {
        const { order_id, razorpay_order_id } = response.data;

        if (paymentMode === 0) {
          dispatch(emptyCart());
          notify("Order placed successfully!", 0);
          router.push("/order-placed/" + order_id);
          return;
        }

        const options = {
          key:       process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
          amount:    totalAmount * 100,
          currency:  "INR",
          name:      "ISHOP",
          order_id:  razorpay_order_id,
          prefill:   { name: user?.data?.name || "", email: user?.data?.email || "" },
          theme:     { color: "#00bba7" },
          handler:   async function (razorpayResponse) {
            try {
              const verify = await axiosApiInstrector.post(
                "/order/verify-payment",
                {
                  razorpay_order_id:   razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature:  razorpayResponse.razorpay_signature,
                  order_id,
                },
                { headers: { authorization: user?.token } }
              );
              if (verify.data.flag === 0) {
                dispatch(emptyCart());
                notify("Payment successful! Order placed.", 0);
                router.push("/order-placed/" + order_id);
              } else {
                notify(verify.data.msg || "Payment verification failed. Contact support.", 1);
              }
            } catch (err) {
              if (process.env.NODE_ENV !== "production") console.error(err);
              notify("Payment verification error. Please contact support.", 1);
            }
          },
          modal: {
            ondismiss: () => { notify("Payment cancelled.", 1); setIsPlacingOrder(false); },
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          notify(`Payment failed: ${resp.error.description}`, 1);
          setIsPlacingOrder(false);
        });
        rzp.open();
        return;
      } else {
        notify(response.data.msg || "Failed to place order. Please try again.", 1);
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error(err);
      notify(err?.response?.data?.msg || "Something went wrong. Please try again.", 1);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaTruck className="text-teal-500 text-xl" />
                  <h2 className="text-2xl font-bold text-slate-800">Shipping Address</h2>
                </div>
                <Link href="/account/address" className="text-sm text-teal-600 hover:underline">
                  Manage →
                </Link>
              </div>

              {!user?.data?.shipping_address?.length ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-3">No shipping addresses found.</p>
                  <Link
                    href="/account/address"
                    className="inline-block px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition"
                  >
                    + Add an address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.data.shipping_address.map((address, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentAddress(idx)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        idx === currentAddress
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
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
                            <p className="font-semibold text-slate-800">
                              {address.name || user.data.name}
                            </p>
                            {idx === user?.data?.default_address && (
                              <span className="text-xs font-bold bg-teal-500 text-white px-3 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mt-2">
                            {address.addressLine1}
                            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {address.city}, {address.state}, {address.country} {address.pincode}
                          </p>
                          {address.contact && (
                            <p className="text-slate-600 text-sm mt-1">📞 {address.contact}</p>
                          )}
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
                {[
                  { id: 0, label: "Cash on Delivery", desc: "Pay when you receive (+₹49 shipping)" },
                  { id: 1, label: "Pay Now",           desc: "Secure online payment (free shipping)" },
                ].map((method) => (
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

          {/* Order Summary */}
          <OrderSummary
            final_total={cart?.final_total}
            original_total={cart?.original_total}
            paymentMode={paymentMode}
            orderPlaceHandler={orderPlaceHandler}
            isPlacingOrder={isPlacingOrder}
            isRazorpayLoading={isRazorpayLoading}
          />
        </div>
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center text-sm text-slate-600">
      <Link href="/" className="hover:text-teal-600">Home</Link>
      <FaChevronRight className="mx-3 text-xs" />
      <Link href="/cart" className="hover:text-teal-600">Cart</Link>
      <FaChevronRight className="mx-3 text-xs" />
      <span className="text-teal-600 font-semibold">Checkout</span>
    </div>
  );
}

function OrderSummary({ final_total, original_total, paymentMode, orderPlaceHandler, isPlacingOrder, isRazorpayLoading }) {
  const extra    = paymentMode === 0 ? 49 : 0;
  const disabled = isPlacingOrder || isRazorpayLoading;

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
              -{toLocalPrice((original_total || 0) - (final_total || 0))}
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
            <span className="text-2xl font-bold text-teal-600">
              {toLocalPrice((final_total || 0) + extra)}
            </span>
          </div>
        </div>

        <button
          onClick={orderPlaceHandler}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <><FaSpinner className="animate-spin" /> Processing...</>
          ) : (
            <><FaCheckCircle /> {paymentMode === 1 ? "PROCEED TO PAYMENT" : "PLACE ORDER"}</>
          )}
        </button>

        <Link href="/cart" className="mt-4 block w-full text-center border border-slate-300 text-slate-600 py-3 rounded-xl hover:bg-slate-100 transition">
          Back to Cart
        </Link>
        <p className="text-center text-xs text-slate-500 mt-4">✓ Secure &amp; encrypted payment</p>
      </div>
    </div>
  );
}
