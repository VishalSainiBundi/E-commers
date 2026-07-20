import { getBrands } from "@/api-calls/brand";
import { getCategories } from "@/api-calls/category";
import Image from "next/image";
import Link from "next/link";
export default async function Section2() {
  const brandJSON = await getBrands({ best: true, status: true, limit: 5 });
  const brands = brandJSON.brands || [];
  const brandImgUrl = brandJSON.imageUrl || "";
  const categoryJSON = await getCategories({ top: true, status: true, limit: 5 });
  const topCategories = categoryJSON.categories || [];
  const catImgUrl = categoryJSON.imageUrl || "";
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* Featured Brands */}
        <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-gray-800 font-semibold text-base sm:text-lg">BEST BRANDS</h2>
            <Link
              href="/brands"
              className="text-[#01A49E] text-xs sm:text-sm font-medium hover:underline transition"
            >
              View All
            </Link>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start  gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-3 sm:gap-y-4">
            {brands.map((brand, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-50 rounded-lg sm:rounded-xl py-3 sm:py-4 hover:shadow-md hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  {/* <img className="rounded-lg object-contain"                    width={80} height={40} src={catImgUrl + cat.image_name} /> */}
                  {/* <Image                    src={cat.img}                    alt={cat.name}                    width={80}                    height={80}                    className="rounded-lg object-contain"                  /> */}
                </div>
                <Link href={`/store/brand/${brand?.slug}`}>
                  <span className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700">
                    {brand.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Top Categories */}
        <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-gray-800 font-semibold text-base sm:text-lg">TOP CATEGORIES</h2>
            <Link
              href={`/store/`}
              className="text-[#01A49E] text-xs sm:text-sm font-medium hover:underline transition"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {topCategories.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-50 rounded-lg sm:rounded-xl py-3 sm:py-4 hover:shadow-md hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <img
                    className="rounded-lg object-contain"
                    width={80}
                    height={40}
                    src={catImgUrl + cat.image_name}
                  />
                  {/* <Image                    src={cat.img}                    alt={cat.name}                    width={80}                    height={80}                    className="rounded-lg object-contain"                  /> */}
                </div>
                <Link href={`/store/${cat.slug}`}>
                  <span className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700">
                    {cat.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
