"use client";
import React from "react";
import BestSellerSlider from "./BestSellerSlider";
import ProductGridSection from "./ProductGridSection";
import { productsData, storecategories } from "@/api-calls/product";
import FilterControlsDesktop from "./FilterControlsDesktop";
import FilterControlsMobile from "./FilterControlsMobile";
import CategoryList from "./CategoryList";
const exampleCategories = ["Tablets", "iPads", "Android Tablets", "Gaming Tablets", "Accessories"];
const exampleBrands = [
  { id: "apple", name: "Apple", count: 12 },
  { id: "samsung", name: "Samsung", count: 8 },
];
const exampleColors = ["Red", "Blue", "Black", "White"];
export default function Storemain() {
  return (
    <div className="relative overflow-hidden w-full max-w-7xl mx-auto grid grid-cols-4 gap-4  lg:px-0 py-8">
      {/* ---------------- LEFT SIDE ---------------- */}
      <aside className="col-span-4 lg:col-span-1 space-y-6">
        <CategoryList categories={storecategories} />
        <div className="hidden lg:block">
          <FilterControlsDesktop
            categories={exampleCategories}
            brands={exampleBrands}
            colors={exampleColors}
          />
        </div>
        <img
          className="hidden lg:block w-full rounded-lg"
          src="/images/storeimg.png"
          alt="Store Banner"
        />
      </aside>
      {/* ---------------- RIGHT SIDE PRODUCT GRID ---------------- */}
      <section className="col-span-4 lg:col-span-3 relative">
        {/* MOBILE FILTER FIXED ONLY IN THIS AREA */}
        <div className="lg:hidden  z-30 bg-white border-b border-gray-200 px-4  ">
          <FilterControlsMobile
            categories={exampleCategories}
            brands={exampleBrands}
            colors={exampleColors}
            initialState={{}}
            onApply={(filters, sortValue) => {
              console.log("Applied (store page):", filters, sortValue);
            }}
          />
        </div>
        {/* spacer for fixed bar */} <div className="h-[60px] lg:hidden"></div> <BestSellerSlider />
        <ProductGridSection products={productsData} />
      </section>
    </div>
  );
}
