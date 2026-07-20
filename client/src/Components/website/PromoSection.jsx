"use client";
import Image from "next/image";
import watch from "../../../public/images/watch.png";
export default function PromoSection() {
  return (
    <section className="w-full ">
      <div className="max-w-7xl  bg-linear-to-r from-teal-600 to-[#4B7BAF] text-white rounded-3xl flex flex-col md:flex-row items-center md:justify-around lg:justify-between py-8 px-3 lg:py-7  md:px-12 gap-10  relative overflow-hidden mx-auto">
        <div className=" text-center lg:text-left">
          <h2 className="text-xl md:text-xl font-semibold tracking-wide"> PRE ORDER </h2>
          <p className="text-sm md:text-xs text-gray-200 uppercase mb-2"> Be the first to own </p>
          <p className=" text-xl lg:text-lg font-medium">From $399</p>
        </div>
        <div className=" flex-1 absolute bottom-0 right-1/2 hidden lg:flex ">
          <Image
            src={watch}
            alt="Apple Watch"
            width={280}
            height={250}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
        <div className=" flex flex-col md:flex-row md:gap-20 text-center lg:text-right mb-15 md:mb-0 ">
          <div>
            <p className="text-xl md:text-xl text-gray-200">
              Opple Watch Sport
              <br />
              Series 8
            </p>
            <h3 className="text-lg md:text-lg lg:text-2xl font-light "> A healthy leap ahead </h3>
          </div>
          <button className="m-2 md:m-6  bg-white text-gray-900 font-semibold px-5  text-sm rounded-full hover:shadow-md transition">
            Discover Now
          </button>
          <div className="flex justify-center flex-1 absolute bottom-0  md:hidden ">
            <Image
              src={watch}
              alt="Apple Watch"
              width={130}
              height={100}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
