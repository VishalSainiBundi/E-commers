import Link from "next/link"

const Data=[
{
        name:"Dashboard",
        link:"/admin"

    },{
        name:"Catogory",
        link:"/admin/category"

    },{
        name:"Product",
        link:"/admin/product"

    },
    {
    name:"Brand",
    link:"/admin/brand"
    },{
    name:"Color",
    link:"/admin/color"
    },{
        name:"User",
        link:"/admin/profile"

    },
]

const SideMenu=()=>{
    return(<div className="w-[215px]"><aside className="w-64 min-h-screen fixed md:static bg-white border-r shadow-sm flex flex-col">
        <div className="px-6 py-6 bg-indigo-600 text-white text-2xl font-semibold">
          Admin Panel
        </div>

        <nav className="flex-1 px-5 py-6 space-y-3">
          {Data.map((da,ind) => (
            <div
            key={ind}
              className="p-3 rounded-md hover:bg-indigo-100 cursor-pointer transition font-medium"
              
            >
             <Link href={da.link} >{da.name}</Link>
            </div>
          ))}
        </nav>
      </aside></div>)
}
export default SideMenu


