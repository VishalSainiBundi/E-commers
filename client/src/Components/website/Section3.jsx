import Section3ImageSliderClient from "./Section3ImageSliderClient";
import Section3TimerClient from "./Section3TimerClient";
import { getCategories } from "@/api-calls/category";

export default async function Section3() {
  const productImages = [
    "/images/mobile.png",
    "/images/xiomi2.png",
    "/images/xiomi3.png",
    "/images/xiomi4.png",
  ];

  const categoryJSON = await getCategories({ status: true, best: true, limit: 3 });
  const bestCategories = categoryJSON.categories || [];
  const catImgUrl = categoryJSON.imageUrl || "";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-6 sm:py-8 lg:py-10">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Today's Hot Deals
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Limited time offers - Grab them before they're gone!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-md p-5 sm:p-6 flex flex-col md:flex-row gap-6">
          <Section3ImageSliderClient productImages={productImages} />
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-gray-800 font-bold text-lg sm:text-xl md:text-2xl mb-2 leading-tight">
                Xioma Redmi Note 11 Pro 256GB 2023, Black Smartphone
              </h2>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-[#01A49E] text-2xl sm:text-3xl font-semibold">$569.00</p>
                <span className="text-gray-400 line-through text-base sm:text-lg">$759.00</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  -25% OFF
                </span>
              </div>
              <ul className="mt-4 text-xs sm:text-sm text-gray-700 space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#01A49E]">✓</span>Intel LGA 1700 Socket: Supports 13th &
                  12th Gen CPUs
                </li>
                <li className="flex gap-2">
                  <span className="text-[#01A49E]">✓</span>DDR5 Compatible: 4xDIMM Slots with XMP
                  3.0
                </li>
                <li className="flex gap-2">
                  <span className="text-[#01A49E]">✓</span>Twin 16+1+2 Phase Digital VRM
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1.5 bg-[#01A49E]/10 border border-[#01A49E] rounded-full text-[#01A49E] text-xs font-semibold">
                  Free Shipping
                </span>
                <span className="px-3 py-1.5 bg-[#01A49E]/10 border border-[#01A49E] rounded-full text-[#01A49E] text-xs font-semibold">
                  Free Gift
                </span>
              </div>
              <div className="mt-6">
                <p className="text-sm font-bold text-gray-800 mb-2">
                  Hurry up! Promotion will expire in:
                </p>
                <Section3TimerClient />
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  <span>Sold: 26/75</span>
                  <span className="text-[#01A49E]">35% Sold</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-linear-to-r from-[#01A49E] to-[#019089] rounded-full"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Best Categories
          </h2>
          {bestCategories.map((bestCat) => (
            <div
              key={bestCat._id ?? bestCat.slug ?? bestCat.name}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-[200px] mb-3"
            >
              <img
                src={catImgUrl + bestCat.image_name}
                alt={bestCat.name}
                className="h-[100%] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-[#01A49E] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {bestCat.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
