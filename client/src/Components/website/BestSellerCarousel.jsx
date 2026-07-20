import BestSellerCarouselClient from "./BestSellerCarouselClient";
export default function BestSellerCarousel({ products }) {
  const tabs = ["BEST SELLER", "NEW IN", "POPULAR"];
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Tabs - SSR */}
      <div className="flex items-center justify-between mb-6">
        <ul className="flex items-center gap-6 text-sm sm:text-base">
          {tabs.map((t) => (
            <li key={t} className="cursor-pointer">
              <span className="font-semibold cursor-pointer tracking-wide text-gray-700">{t}</span>
            </li>
          ))}
        </ul>
        <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">
          View All
        </a>
      </div>
      {/* CSR Slider */} <BestSellerCarouselClient products={products} />
    </section>
  );
}
