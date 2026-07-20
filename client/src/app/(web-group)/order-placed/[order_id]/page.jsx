'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaHome,
} from 'react-icons/fa';

const ORDER_STEPS = [
  {
    label: 'Order Confirmed',
    icon: FaBox,
    color: 'text-blue-500',
    active: true,
  },
  {
    label: 'Shipping Soon',
    icon: FaTruck,
    color: 'text-yellow-500',
    active: false,
  },
  {
    label: 'Delivery',
    icon: FaHome,
    color: 'text-green-500',
    active: false,
  },
];

export default function OrderPlaced() {
  const params = useParams();
  const orderId =
    typeof params?.order_id === 'string'
      ? params.order_id
      : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center"
        aria-live="polite"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        {/* Order ID */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">
            Order ID
          </p>
          <p className="text-2xl font-mono font-bold text-gray-800">
            {orderId}
          </p>
        </div>

        <hr className="mb-6" />

        {/* Order Status */}
        <div className="space-y-4 mb-8 text-left">
          {ORDER_STEPS.map(({ label, icon: Icon, color, active }) => (
            <div
              key={label}
              className={`flex items-center gap-3 ${
                active ? 'font-medium text-gray-800' : 'text-gray-500'
              }`}
            >
              <Icon className={`${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            View Orders
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
