import Image from "next/image";
export default function CategoryGrid({ categories }) {
  return (
    <section aria-labelledby="popular-categories" className="mt-8">
      <h3 id="popular-categories" className="text-sm font-semibold text-gray-800 mb-4">
        POPULAR CATEGORIES
      </h3>
      <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src={cat.img} alt={cat.name} fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.items}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
