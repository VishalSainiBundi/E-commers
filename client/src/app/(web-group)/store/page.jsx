import { getProduct } from "@/api-colls/product";
import ListingHeader from "@/Components/website/ListingHeader";
import ProductCardStore from "@/Components/website/ProductCart2";
import SideBar from "@/Components/website/SideBar";

/* =========================   Store Page Component ========================= */
export default async function Page({ searchParams }) {
  // ✅ FIX: unwrap the Promise
  const params = await searchParams;
  const query = { status: true };

  if (params?.brand_ids) query.brand_ids =  params.brand_ids;
  if (params?.color_ids) query.color_ids =  params.color_ids;
  if (params?.sortby) query.sortby =  params.sortby;
  if (params?.limit) query.limit =  params.limit;

  const productJSON = await getProduct(query);

  const productData = productJSON?.product || [];
  const productImg = productJSON?.img_Url || "";

  const featuredProducts = productData.filter(
    (product) => product.is_featured
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3">
        <SideBar />
      </aside>

      {/* Main Content */}
      <main className="col-span-12 lg:col-span-9 space-y-10">
        {featuredProducts.length > 0 && (
          <FeaturedSection
            featuredProducts={featuredProducts}
            imgUrl={productImg}
          />
        )}

        <section className="space-y-6">
          <ListingHeader />
          <ProductListing
            productData={productData}
            productImg={productImg}
          />
        </section>
      </main>
    </div>
  );
}

/* =========================   Featured Products Section ========================= */
function FeaturedSection({ featuredProducts, imgUrl }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCardStore
            key={product._id}
            {...product}
            img={`${imgUrl}${product.thumbnail}`}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================   Product Listing Section ========================= */
function ProductListing({ productData, productImg }) {
  if (!productData.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center border">
        <h3 className="text-xl font-semibold text-slate-800">
          No products found
        </h3>
        <p className="text-slate-500 mt-2">
          Try adjusting filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {productData.map((product) => (
        <ProductCardStore
          key={product._id}
          {...product}
          img={`${productImg}${product.thumbnail}`}
        />
      ))}
    </div>
  );
}
