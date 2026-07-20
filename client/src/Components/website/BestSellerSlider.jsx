"use client";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard2 from "./ProductCard2.jsx";
import { bestsellerproducts } from "@/api-calls/product.jsx";
export default function BestSellerSlider() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: "start" });
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  return (
    <section className="w-full  pb-10">
      <h2 className="text-2xl lg:text-[25px] font-semibold text-gray-900 mb-3 p-3">
        BEST SELLER IN THIS CATEGORY
      </h2>
      <div className="relative">
        <button
          onClick={scrollPrev}
          className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full cursor-pointer bg-white shadow-md"
        >
          ‹
        </button>
        <button
          onClick={scrollNext}
          className="absolute -right-4 lg:right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full cursor-pointer bg-white shadow-md"
        >
          ›
        </button>
        <div className="overflow-x-hidden px-6" ref={emblaRef}>
          <div className="flex gap-4 lg:gap-6">
            {bestsellerproducts.map((item) => (
              <div
                key={item.id}
                className="                  flex-[0_0_85%]                  sm:flex-[0_0_45%]                  md:flex-[0_0_30%]                  lg:flex-[0_0_23%]                "
              >
                <ProductCard2 product={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
