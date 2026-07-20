

// import { useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

import { getBrandById } from "@/api-colls/brand"
import BrandEdit from "@/Components/admin/brandEdit"


export default async function EditBrand({ params }) {
  const resolvePromise= await params
  const id=resolvePromise?.brand_id
  const brandData= await getBrandById(id)
  const baseUrl = brandData.img_Url
  
  return(
    <BrandEdit brand={brandData.brand} baseUrl={baseUrl}/>
  )
} 