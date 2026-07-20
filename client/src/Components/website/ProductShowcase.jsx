"use client";

import Image from "next/image";
import { useMemo } from "react";

const mockProducts = [
  {
    id: 1,
    title: "BOSO 2 Wireless On Ear Headphone",
    price: 359.0,
    oldPrice: null,
    badge: null,
    shipping: "FREE SHIPPING",
    stock: "In stock",
    img: "/images/headphone.png",
    count: 152,
  },
  {
    id: 2,
    title: "OPad Pro 12.9 Inch M1 2023, 64GB + Wifi, GPS",
    price: 569.0,
    oldPrice: 759.0,
    badge: { text: "SAVE $199.00", color: "bg-emerald-500" },
    shipping: "FREE SHIPPING",
    stock: "In stock",
    img: "/images/tablet.png",
    count: 152,
  },
];

function Price({ price, oldPrice, priceRange }) {
  if (priceRange) return <div className="text-sm font-semibold text-gray-900">{priceRange}</div>;
  return (
    <div className="flex items-baseline gap-3">
      <div className="text-sm font-semibold text-gray-900">${price?.toFixed(2)}</div>
      {oldPrice ? (
        <div className="text-sm line-through text-gray-400">${oldPrice.toFixed(2)}</div>
      ) : null}
    </div>
  );
}

export default function ProductShowcase() {
  const products = useMemo(() => mockProducts, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Best Seller</h2>
        <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <article key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="relative h-44 rounded-t-2xl overflow-hidden bg-gray-50">
              {p.badge ? (
                <span
                  className={`absolute top-3 left-3 text-[11px] font-bold text-white z-10 px-2 py-1 rounded ${p.badge.color} shadow`}
                >
                  {p.badge.text}
                </span>
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-40 aspect-square">
                  <Image src={p.img} alt={p.title} fill className="object-contain" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs text-gray-400 mb-2">({p.count})</div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2 leading-snug">{p.title}</h3>
              <div className="mb-3">
                <Price price={p.price} oldPrice={p.oldPrice} />
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  {p.shipping}
                </span>
                <span className="text-[11px] text-gray-500">{p.stock}</span>
              </div>
              <button className="w-full bg-[#01A49E] text-white text-sm font-semibold px-3 py-2 rounded-full hover:brightness-105 transition">
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
