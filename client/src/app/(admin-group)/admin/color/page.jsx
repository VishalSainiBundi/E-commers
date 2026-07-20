import Link from "next/link";
import StatusBtn from "@/Components/admin/status_Btn";
import Delete from "@/Components/admin/delete_Btn";
import { getColor } from "@/api-colls/color";
export default async function ColorListing() {
  const res = await getColor();
const color = res.color || [];
  console.log(color)

  return (
    <div className="min-h-screen p-10 bg-gray-50 text-gray-900 max-w-full mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12 ">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Color Listing</h1>
          <p className="text-gray-500 mt-2">Manage all your product Colors.</p>
        </div>

        <Link
          href="/admin/color/add"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow transition"
        >
          + Add Color
        </Link>
      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b text-left">
              <th className="p-4 text-sm font-semibold">Name</th>
              <th className="p-4 text-sm font-semibold">Code</th>
              <th className="p-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {color.map((cat, index) => (
              <tr key={index} className="hover:bg-gray-50 transition ">


                {/* NAME */}
                <td className="p-4 font-medium ">{cat.name}</td>

                {/* SLUG */}
                <td className="p-4 text-gray-600">{cat.code}</td>

                {/* STATUS */}
                <td className="p-4">
                  <StatusBtn status={cat.status.toString()} url={`color/status/${cat._id}`} flag="1" label="status" />
                  
                </td>
                

                
               

          
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <Link
                      href={`/admin/color/edit/${cat._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </Link>

                                       <Delete url={ `color/delete/${cat._id}`} />

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