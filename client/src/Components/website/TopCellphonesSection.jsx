"use client";
import Image from "next/image";
import Link from "next/link";
export default function TopCellphonesSection({
  title,
  bannerTitle,
  bannerDesc,
  bannerImg,
  categories = [],
}) {
  return (
    <section className="max-w-7xl m-auto bg-white py-10 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900"> {title} </h2>
        <Link
          href="#"
          className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          View All
        </Link>
      </div>
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Feature Banner */}
        <div
          className="lg:col-span-5 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 bg-no-repeat bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${bannerImg})` }}
        >
          <div className="bg-black/40 p-4 rounded-xl w-fit">
            <h3 className="text-lg md:text-xl font-semibold">{bannerTitle}</h3>
            <p className="text-sm mt-1 text-gray-100">{bannerDesc}</p>
          </div>
          <Link
            href="#"
            className="mt-6 inline-block bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors w-fit"
          >
            SHOP NOW
          </Link>
        </div>
        {/* Right Categories */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Image
                src={cat.img}
                alt={`${cat.name} thumbnail`}
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                <span className="text-xs text-gray-500">{cat.items}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
