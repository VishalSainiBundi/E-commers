

// import { useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

import { getCategoryById } from "@/api-colls/category"
import CategoryEdit from "@/Components/admin/categoryEdit"

export default async function EditCategory({ params }) {
  const resolvePromise= await params
  const id=resolvePromise?.category_id
  const categoryData= await getCategoryById(id)
  const baseUrl = categoryData.img_Url
  // console.log(category)
  return(
    <CategoryEdit category={categoryData.category} baseUrl={baseUrl}/>
  )
} 