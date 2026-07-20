import HeroCarousel from "./HeroCarousel";
import CategoryGrid from "./CategoryGrid";
export default function Storehero({ data }) {
  if (!data) return null;
  return (
    <section className="w-full">
      <header className="mb-4 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900"> {data.title} </h2>
        <a href="#" className="text-sm text-gray-500 hover:text-gray-800">
          View All
        </a>
      </header>
      <HeroCarousel slides={data.heroSlides} promo={data.promoCard} />
      <CategoryGrid categories={data.categories} />
    </section>
  );
}
