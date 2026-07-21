import Link from "next/link";
import StatusBtn from "@/Components/admin/status_Btn";
import Delete from "@/Components/admin/delete_Btn";
import { getCategory } from "@/api-colls/category";

export const dynamic = "force-dynamic";

export default async function CategoryListing() {
  const res = await getCategory();
  const categories = res.category ?? [];
  // console.log(categories)

  return (
    <div className="min-h-screen p-10 bg-gray-50 text-gray-900 max-w-full mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12 ">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Category Listing</h1>
          <p className="text-gray-500 mt-2">Manage all your product categories.</p>
        </div>

        <Link
          href="/admin/category/add"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow transition"
        >
          + Add Category
        </Link>
      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b text-left">
              <th className="p-4 text-sm font-semibold">Image</th>
              <th className="p-4 text-sm font-semibold">Name</th>
              <th className="p-4 text-sm font-semibold">Slug</th>
              <th className="p-4 text-sm font-semibold">Status</th>
              <th className="p-4 text-sm font-semibold">Top Category</th>
              <th className="p-4 text-sm font-semibold">On Home</th>
              <th className="p-4 text-sm font-semibold">Best Category</th>
              <th className="p-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {categories.map((cat, index) => (
              <tr key={index} className="hover:bg-gray-50 transition ">

                {/* IMAGE */}
                <td className="p-4">
                  <div className="h-16 w-20 overflow-hidden rounded-lg border bg-gray-100">
                    <img
                      src={res.img_Url + cat.img || "/placeholder.png"}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                {/* NAME */}
                <td className="p-4 font-medium ">{cat.name}</td>

                {/* SLUG */}
                <td className="p-4 text-gray-600">{cat.slug}</td>

                {/* STATUS */}
                <td className="p-4">
                  <StatusBtn status={cat.status.toString()} url={`category/status/${cat._id}`} flag="1" label="status" />
                </td>

                {/* TOP CATEGORY */}
                <td className="p-4">
                  <StatusBtn status={cat.is_top} url={`category/status/${cat._id}`} flag="3" label="is_top" />
                </td>

                {/* ON HOME */}
                <td className="p-4">
                  <StatusBtn status={cat.on_home} url={`category/status/${cat._id}`} flag="2" label="on_home" />
                </td>

                {/* BEST CATEGORY */}
                <td className="p-4">
                  <StatusBtn status={cat.is_best} url={`category/status/${cat._id}`} flag="4" label="is_best" />
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <Link
                      href={`/admin/category/edit/${cat._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </Link>

                    <Delete url={ `category/delete/${cat._id}`} />
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