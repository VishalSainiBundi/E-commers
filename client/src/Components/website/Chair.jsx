import { getProduct } from "@/api-colls/product";
import { toLocalPrice } from "@/helper/helper";

export default async function HomeChair() {
  // 1️⃣ Fetch data on server
  const ProductJson = await getProduct({ status: true });
  const Product = Array.isArray(ProductJson?.product) ? ProductJson.product : [];
  const imgUrl = ProductJson?.img_Url || "";

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      {/* Top Banners */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Left Banner */}
        <div className="bg-teal-500 rounded-xl p-6 flex items-center justify-between text-white">
          <div>
            <h2 className="text-sm uppercase tracking-wide">Massage Chair</h2>
            <h1 className="text-2xl font-bold mt-1">Luxury</h1>
            <p className="text-sm mt-2">
              Fuka Relax Full Body<br />Massage Chair
            </p>
            <button className="mt-4 bg-white text-teal-600 px-4 py-2 rounded-full text-sm font-semibold">
              Shop Now
            </button>
          </div>

          <img
            src="img/chair.png"
            alt="Massage Chair"
            className="w-40 object-contain"
          />
        </div>

        {/* Right Banner */}
        <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-center">
          <img
            src="img/gaming.jpg"
            alt="Gaming Banner"
            className="w-40"
          />
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Your Recently Viewed</h2>
          <button className="text-sm text-gray-500 hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {Product.map((pr, ind) => (
            <ProductCard
              key={ind}
              pr={pr}
              imgUrl={imgUrl}
              highlight
            />
          ))}
        </div>
      </section>
    </main>
  );
}

// =================== ProductCard Component ===================
function ProductCard({ pr, imgUrl, highlight }) {
  // ✅ Discount calculation
  const Save = (discount_presentage, final_price) => {
    const discount = Number(String(discount_presentage || 0).replace("%","")) || 0;
    const price = Number(String(final_price || 0).replace(/[^0-9.]/g,"")) || 0;
    const Dis = (discount / 100) * price;
    return Dis.toFixed(2); // 2 decimals
  };

  const savedAmount = Save(pr.discount_presentage, pr.final_price);

  return (
    <div className="relative bg-white border rounded-lg p-4 hover:shadow-md transition">
      {/* Discount Badge */}
      {Number(savedAmount) > 0 && (
        <div className="absolute top-2 left-2  bg-[#01A49E] text-white text-xs font-semibold px-2 py-1 rounded text-center">
          Save {toLocalPrice(savedAmount)}
        </div>
      )}

      {/* Product Image */}
      <img
        src={imgUrl + pr.thumbnail}
        alt={pr.name}
        className="w-full h-32 object-contain mb-4 mt-5"
      />

      {/* Product Name */}
      <h3 className="text-sm text-gray-700 line-clamp-2 mb-2">{pr.name}</h3>

      {/* Prices */}
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${highlight ? "text-teal-600" : "text-gray-900"}`}>
          {toLocalPrice(pr.final_price)}
        </span>

        {pr.original_price && (
          <span className="text-sm text-gray-400 line-through">
            {toLocalPrice(pr.original_price)}
          </span>
        )}
      </div>
    </div>
  );
}
