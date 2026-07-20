import Link from "next/link";
import StatusBtn from "@/Components/admin/status_Btn";
import Delete from "@/Components/admin/delete_Btn";
import { getProduct } from "@/api-colls/product";
import MultiImage from "@/Components/multipleImage";
export default async function productListing() {
  const res = await getProduct();
  const product = res.product;
  const img_Url=res.img_Url
console.log(res)
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Listing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your products
          </p>
        </div>

        <Link
          href="/admin/product/add"
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b text-gray-600">
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name / Slug</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Details</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Home</th>

              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Hot</th>
              <th className="p-4 text-center">Best</th>

              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {product ?.map((cat, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition"
              >
                {/* IMAGE */}
                <td className="p-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden border bg-gray-100">
                    <img
                      src={img_Url + cat.thumbnail || "/placeholder.png"}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                {/* NAME */}
                <td className="p-4">
                  <p className="font-medium text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.slug}</p>
                </td>

                {/* PRICE */}
                <td className="p-4">
                  <p className="text-xs text-gray-400 line-through">
                    ${cat.original_price}
                  </p>
                  <p className="text-xs text-green-600">
                    {cat.discount_presentage}% OFF
                  </p>
                  <p className="font-semibold text-gray-800">
                    ${cat.final_price}
                  </p>
                </td>

                {/* DETAILS */}
                <td className="p-4 text-xs text-gray-600 space-y-1">
                  <p><b>Category:</b> {cat.category_id.name}</p>
                  <p><b>Brand:</b> {cat.brand_id.name}</p>
                  <div className="flex items-center gap-1">
                    <b>Color:</b>
                    {cat.color_id.map((color, i) => (
                      <span
                        key={i}
                        title={color.name}
                        className="w-4 h-4 rounded-full border"
                        style={{ background: color.code }}
                      />
                    ))}
                  </div>
                </td>

                {/* STATUS BUTTONS */}
                <td className="p-2 text-center">
                  <StatusBtn status={cat.status.toString()} url={`product/status/${cat._id}`} flag="1" label="status" />
                </td>

                <td className="p-2 text-center">
                  <StatusBtn status={cat.on_home} url={`product/status/${cat._id}`} flag="2" label="on_home" />
                </td>
                <td className="p-2 text-center">
                  <StatusBtn status={cat.stock} url={`product/status/${cat._id}`} flag="7" label="stock" />
                </td>
<td className="p-2 text-center">
                  <StatusBtn status={cat.is_hot} url={`product/status/${cat._id}`} flag="5" label="is_hot" />
                </td>

                <td className="p-2 text-center">
                  <StatusBtn status={cat.is_best} url={`product/status/${cat._id}`} flag="4" label="is_best" />
                </td>

                {/* <td className="p-2 text-center">
                  <StatusBtn status={cat.is_top} url={`product/status/${cat._id}`} flag="3" label="is_top" />
                </td> */}

                

                <td className="p-2 text-center">
                  <StatusBtn status={cat.is_featured} url={`product/status/${cat._id}`} flag="6" label="is_featured" />
                </td>

                {/* ACTIONS */}
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-3">
                    <MultiImage product_id={cat._id} other_images={cat.other_images} api_url="/product/add_other_images"
                  />
                  
                    <Link
                      href={`/admin/product/edit/${cat._id}`}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <Delete url={`product/delete/${cat._id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
