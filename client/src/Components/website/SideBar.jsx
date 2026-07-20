"use client";

import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getBrand } from "@/api-colls/brand";
import { getColor } from "@/api-colls/color";
import { getCategory } from "@/api-colls/category";

export default function SideBar() {
  const firstRenderRef = useRef(false);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { category_slug } = params;

  const [categories, setCategory] = useState([]);
  const [brands, setBrand] = useState([]);
  const [colors, setColor] = useState([]);
  const [brandIds, setBrandIds] = useState([]);
  const [colorIds, setColorIds] = useState([]);
  /* ================= RESET FILTERS ON CATEGORY CHANGE ================= */
  useEffect(() => {
    if (!firstRenderRef.current) {
      firstRenderRef.current = true;
      return;
    }
    setBrandIds([]);
    setColorIds([]);
  }, [pathname]);

  /* ================= SYNC STATE → URL (NO LOOP) ================= */
  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());

    query.delete("brand_ids");
    if (brandIds.length) query.append("brand_ids", brandIds.join("_"));

    query.delete("color_ids");
    if (colorIds.length) query.append("color_ids", colorIds.join("_"));

    const newQuery = query.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [brandIds, colorIds, pathname, router]); // ✅ searchParams removed

  /* ================= BRAND TOGGLE ================= */
  const handleBrandSelect = (e) => {
    const brandId = e.target.value;
    setBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  /* ================= COLOR TOGGLE ================= */
  const handleColorSelect = (e) => {
    const colorId = e.target.value;
    setColorIds((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    const categoryJSON = await getCategory({ status: true });
    setCategory(categoryJSON?.category || []);

    const brandJSON = await getBrand({ status: true });
    setBrand(brandJSON?.brand || []);

    const colorJSON = await getColor();
    setColor(colorJSON?.color || []);
  };

  /* ================= INIT FROM URL ================= */
  useEffect(() => {
    fetchData();

    const brandQuery = searchParams.get("brand_ids");
    const colorQuery = searchParams.get("color_ids");

    if (brandQuery) setBrandIds(brandQuery.split("_"));
    if (colorQuery) setColorIds(colorQuery.split("_"));
  }, []); // ✅ run once only

  return (
    <aside className="col-span-12 lg:col-span-3 bg-white rounded-xl p-5 space-y-6 shadow-sm">
      <CategoryBlock
        current_category={category_slug}
        categories={categories}
      />

      <FilterBlock />

      <BrandFilter
        brands={brands}
        brandIds={brandIds}
        handleBrandSelect={handleBrandSelect}
      />

      <ColorFilter
        colors={colors}
        colorIds={colorIds}
        handleColorSelect={handleColorSelect}
      />
    </aside>
  );
}

/* ========================= CATEGORY BLOCK ========================= */
function CategoryBlock({ categories, current_category }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Categories</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li
          className={
            current_category === undefined
              ? "font-bold text-black"
              : ""
          }
        >
          <Link href="/store">All</Link>
        </li>

        {categories.map((cat) => (
          <li
            key={cat._id}
            className={
              current_category === cat.slug
                ? "font-bold text-black"
                : ""
            }
          >
            <Link href={`/store/${cat.slug}`}>
              {cat.name} ({cat.CatCount})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========================= FILTER BLOCK ========================= */
function FilterBlock() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <button className="text-sm text-gray-400">Reset All</button>
      </div>
    </div>
  );
}

/* ========================= BRAND FILTER ========================= */
function BrandFilter({ brands, brandIds, handleBrandSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">By Brands</h3>
      <ul className="space-y-2 text-sm text-gray-600 grid grid-cols-2">
        {brands.map((brand) => (
          <li key={brand._id} className="flex gap-2 items-center">
            <input
              type="checkbox"
              value={brand.slug}
              checked={brandIds.includes(brand.slug)}
              onChange={handleBrandSelect}
            />
            {brand.name} ({brand.productCount})
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========================= COLOR FILTER ========================= */
function ColorFilter({ colors, colorIds, handleColorSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">By Color</h3>
      <ul className="space-y-2 text-sm text-gray-600 grid grid-cols-4">
        {colors.map((color) => (
          <li key={color._id}>
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                value={color.name}
                checked={colorIds.includes(color.name)}
                onChange={handleColorSelect}
              />
              <span
                className="inline-block rounded p-2 border border-gray-300"
                style={{ background: color.code }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

