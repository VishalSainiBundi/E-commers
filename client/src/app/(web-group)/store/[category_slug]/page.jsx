import { getProduct } from "@/api-colls/product";
import ListingHeader from "@/Components/website/ListingHeader";
import ProductCardStore from "@/Components/website/ProductCart2";
import SideBar from "@/Components/website/SideBar";

/* =========================   Root Page Component ========================= */
export default async function Page({ params, searchParams }) {
  const { category_slug } = await params;
  const query = { category_slug:category_slug, status: true };

  const urlSearchParams = await searchParams;
  if (urlSearchParams.brand_ids) query.brand_ids = await urlSearchParams.brand_ids;
  if (urlSearchParams.color_ids) query.color_ids = await urlSearchParams.color_ids;
  if (urlSearchParams.sortby) query.sortby = await urlSearchParams.sortby;
  if (urlSearchParams.limit) query.limit = urlSearchParams.limit;

  const productJSON = await getProduct(query);
  const imgUrl = productJSON.img_Url;
  const productData = productJSON.product;
  const bestCategoryProducts = productData.filter(
    (prod) => prod.is_best === true
  );

  return (
    <main className="max-w-7xl mx-auto px-4">
      {/* GRID LAYOUT */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="col-span-12 lg:col-span-3">
          <SideBar />
        </aside>

        {/* MAIN CONTENT */}
        <section className="col-span-12 lg:col-span-9 space-y-10">
          {productData.length === 0 ? (
            <p className="text-center text-2xl text-gray-500">
              No products found in this category.
            </p>
          ) : (
            <>
              {bestCategoryProducts.length > 0 && (
                <BestSellerSection
                  imgUrl={imgUrl}
                  bestCategoryProducts={bestCategoryProducts}
                />
              )}

              <section className="space-y-6">
                <ListingHeader />
                <ProductListing
                  imgUrl={imgUrl}
                  productData={productData}
                />
              </section>
            </>
          )}
        </section>

      </div>
    </main>
  );
}

/* =========================   Best Seller Section ========================= */
function BestSellerSection({ bestCategoryProducts, imgUrl }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        Best Seller in this Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {bestCategoryProducts.map((pd) => (
          <ProductCardStore
            key={pd._id}
            {...pd}
            img={`${imgUrl}${pd.thumbnail}`}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================   Product Listing Section ========================= */
function ProductListing({ productData, imgUrl }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {productData.map((pd) => (
        <ProductCardStore
          key={pd._id}
          {...pd}
          img={`${imgUrl}${pd.thumbnail}`}
        />
      ))}
    </div>
  );
}
