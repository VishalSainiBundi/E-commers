"use client";
import Image from "next/image";
import { useState } from "react";
export default function Section3ImageSliderClient({ productImages }) {
  const [currentImg, setCurrentImg] = useState(productImages[0]);
  return (
    <div className="flex flex-col items-center gap-4 relative w-full md:w-auto">
      <div className="absolute -top-2 -right-2 bg-[#01A49E] text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg z-10">
        SAVE $199
      </div>
      <div className="flex flex-col-reverse md:flex-row items-center gap-4">
        {/* Main Large Image */}
        <div className="relative h-[350px] w-[260px] order-2">
          <Image src={currentImg} alt="Main Product" fill className="rounded-xl object-contain" />
        </div>
        <div className="flex md:flex-col justify-center items-center gap-3 ">
          {productImages.map((img, index) => (
            <div
              key={index}
              onClick={() => setCurrentImg(img)}
              className={`rounded-lg border-2 cursor-pointer p-1.5 transition-all duration-300 ${currentImg === img ? "border-[#01A49E] bg-[#01A49E]/5 shadow-md" : "border-gray-200 hover:border-[#01A49E]/50"}`}
            >
              <div className="relative w-10 h-16">
                <Image
                  src={img}
                  alt={`Thumbnail ${index}`}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
