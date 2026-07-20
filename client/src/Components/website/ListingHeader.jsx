// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const ListingHeader=()=> {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [sortBy, setSortBy] = useState(1);
//   const [limit, setLimit] = useState(0);

//   useEffect(() => {
//     if (searchParams.get("sortby")) {
//       setSortBy(Number(searchParams.get("sortby")));
//     }
//     if (searchParams.get("limit")) {
//       setLimit(Number(searchParams.get("limit")));
//     }
//   }, []);

//   useEffect(() => {
//     const query = new URLSearchParams(searchParams.toString());
//     query.delete("sortby");
//     if (sortBy != null) {
//       query.append("sortby", sortBy);
//     }
//     query.delete("limit");
//     if (limit != null) {
//       query.append("limit", limit);
//     }
//     router.replace(`${pathname}?${query.toString()}`, {
//       scroll: false,
//     });
//   }, [sortBy, limit]);

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-4">
//       <p className="text-sm text-gray-500">1 - 40 of 120 results</p>
//       <div className="flex items-center gap-3">
//         <select
//           value={limit}
//           onChange={(e) => setLimit(e.target.value)}
//           className="border rounded-lg px-3 py-2 text-sm"
//         >
//           <option value={2}>2</option>
//           <option value={4}>4</option>
//           <option value={8}>8</option>
//           <option value={0}>All</option>
//         </select>
//         <div className="border border-gray-500 rounded p-1 flex">
//           <div>Sort By</div>
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="focus:outline-0 rounded-lg px-3 text-sm"
//           >
//             <option value={1}>Latest</option>
//             <option value={2}>Oldest</option>
//             <option value={3}>Low to high</option>
//             <option value={4}>High to low</option>
//             <option value={5}>A to Z</option>
//             <option value={6}>Z to A</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ListingHeader



"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ListingHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sortBy, setSortBy] = useState(1);
  const [limit, setLimit] = useState(0);

  // Load values from URL
  useEffect(() => {
    setSortBy(Number(searchParams.get("sortby") ?? 1));
    setLimit(Number(searchParams.get("limit") ?? 0));
  }, [searchParams]);

  // Update URL when values change
  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());

    if (sortBy > 0) {
      query.set("sortby", sortBy.toString());
    } else {
      query.delete("sortby");
    }

    if (limit > 0) {
      query.set("limit", limit.toString());
    } else {
      query.delete("limit");
    }

    router.replace(`${pathname}?${query.toString()}`, {
      scroll: false,
    });
  }, [sortBy, limit, pathname, router, searchParams]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-gray-500">
        Products
      </p>

      <div className="flex items-center gap-3">
        {/* Limit */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={0}>All</option>
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <span className="text-sm">Sort By</span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(Number(e.target.value))}
            className="bg-transparent focus:outline-none text-sm"
          >
            <option value={1}>Latest</option>
            <option value={2}>Oldest</option>
            <option value={3}>Price: Low → High</option>
            <option value={4}>Price: High → Low</option>
            <option value={5}>A → Z</option>
            <option value={6}>Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ListingHeader;