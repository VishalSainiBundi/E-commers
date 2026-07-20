// components/Hero.jsx — SERVER COMPONENT (no "use client")
import { getCategories } from "@/api-calls/category";
import HeroClient from "./HeroClient";
import Link from "next/link";
export default async function Hero() {
  const categoryJSON = await getCategories({ home: true, status: true });
  const categories = categoryJSON.categories || [];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 mt-30 sm:mt-30 md:mt-36">
      {" "}
      {/* small device scroll categories */}{" "}
      <div className="md:hidden mb-4">
        {" "}
        <h2 className="text-gray-800 font-semibold text-sm mb-3 px-1">Browse Categories</h2>{" "}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
          {" "}
          {categories?.map((cat, idx) => (
            <div
              key={idx}
              className="shrink-0 snap-start bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[140px] hover:border-[#01A49E] hover:shadow-md transition-all cursor-pointer group"
            >
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <span className="text-xs font-medium text-gray-700 group-hover:text-[#01A49E] transition-colors">
                  {cat.name}
                </span>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {" "}
        {/* category side bar */}{" "}
        <div className="hidden md:block md:col-span-1 bg-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 h-fit">
          {" "}
          <h2 className="text-gray-800 font-semibold text-base sm:text-lg mb-3 sm:mb-4">
            Category
          </h2>{" "}
          <ul className="space-y-1 sm:space-y-2">
            {" "}
            {categories.map((cat, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between px-3 sm:px-4 py-2 rounded-lg hover:bg-[#01A49E]/10 transition cursor-pointer"
              >
                {" "}
                <Link href={`/store/${cat.slug}`} className="flex items-center flex-1">
                  {" "}
                  <div className="flex py-2 sm:py-3 items-center space-x-2 text-gray-700">
                    {" "}
                    <span className="text-xs sm:text-sm font-medium">{cat.name}</span>{" "}
                  </div>{" "}
                </Link>{" "}
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#01A49E] rounded-full"></span>{" "}
              </li>
            ))}{" "}
          </ul>{" "}
        </div>{" "}
        {/* hero image */}{" "}
        <div className="md:col-span-2 lg:col-span-3 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {" "}
          <img
            src="images/hero.png"
            alt="Grocery deals"
            className="w-full h-80 xs:h-[360px] sm:h-[380px] md:h-[400px] lg:h-[440px] object-cover transform hover:scale-105 transition-transform duration-700"
          />{" "}
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 text-white">
            {" "}
            <div className="animate-fade-in">
              {" "}
              <span className="inline-block bg-[#01A49E] text-white text-[10px] xs:text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-lg">
                🔥 HOT DEALS
              </span>{" "}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 sm:mb-4 drop-shadow-lg">
                {" "}
                Don't miss amazing <br className="hidden xs:block" /> grocery deals{" "}
              </h1>{" "}
            </div>{" "}
            <p className="text-white/90 text-sm xs:text-base sm:text-lg font-medium mb-5 sm:mb-6 drop-shadow-md">
              {" "}
              Sign up for the daily newsletter{" "}
            </p>{" "}
            {/* //client component */} <HeroClient />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
