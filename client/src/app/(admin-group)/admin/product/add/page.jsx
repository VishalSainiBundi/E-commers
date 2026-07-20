"use client";
import { toast } from "react-toastify";

import { useEffect, useRef, useState } from "react";
import { axiosApiInstrector, generateSlug,notify } from "@/helper/helper";
import { getCategory } from "@/api-colls/category";
import { getColor } from "@/api-colls/color";
import { getBrand } from "@/api-colls/brand";
import Select from "react-select";
import FileUpload from "@/Components/common/FileUpload";
// import RichTextEditor from "@/Components/common/editor";
import { useRouter } from "next/navigation";
import { Editor } from 'primereact/editor';
import { GrGallery } from "react-icons/gr";
        




export default function AddProduct() {

  const router= useRouter()
const [categories,setcategories]= useState([])
  const [brands,setbrands]= useState([])
  const [colors,setcolor]= useState([])
  const [main_image, setmain_image] =useState([null])
  const [Description, setDecription]= useState("")
  const [color_ids, setcolorId]= useState([])
const finalPriceRef=useRef()
const originalPriceRef=useRef()
const discountPercentageRef=useRef()



const onChangeHendler=(options)=>{

  const id=options.map(
    (opt)=>opt.value
  )
    setcolorId(id)

}

const fetchOtherData=async()=>{

const categories= await getCategory();
const color= await getColor();
const brand= await getBrand()
// console.log(color.color)

setcategories(categories.category)
setcolor(color.color)
setbrands(brand.brand)


}
const getFile=(file)=>{
setmain_image(file[0])

}
useEffect(
  ()=>{
fetchOtherData()
  },[]
)





const calculateDiscount=()=>{
const op= Number(originalPriceRef.current.value)
const fp= Number(finalPriceRef.current.value)

if(fp > op){
  notify("Final price are qual or lessthen original price",1
  )
  discountPercentageRef.current.value=""
return
}



if(op != "" && fp !=""){

  const disc= 100-((fp/op)*100)
discountPercentageRef.current.value=disc.toFixed(2)
}
}
  const nameRef = useRef();
  const slugRef = useRef();
 const notify = (msg, flag) =>
    toast(msg, { type: flag == 0 ? "success" : "error" });


  function create_slug() {
    const slug = generateSlug(nameRef.current.value);
    slugRef.current.value = slug;
  }

  const Submit_Handler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name",nameRef.current.value)
    formData.append("slug",slugRef.current.value)
    formData.append("finalPrice",finalPriceRef.current.value)
    formData.append("originalPrice",originalPriceRef.current.value)
    formData.append("discountPercentage",discountPercentageRef.current.value)
    formData.append("category_id",event.target.category_id.value)
    formData.append("brand_id",event.target.brand_id.value)
    formData.append("color_ids",JSON.stringify(color_ids))
    formData.append("Description",Description)
    formData.append("thumbnail",main_image?.file)
  
  axiosApiInstrector.post("product/create",formData)
  .then(
(success)=>{
  console.log(success)

notify(success.data.msg,0)
router.push("/admin/product")

}
  ).catch(
(error)=>{
  console.log(error)
  console.log(error.data.msg)
  notify(error.success.data.msg,1)

}
  )
    
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-8">

  <div className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.2)] 
      rounded-[2.5rem] p-12 border border-white/40
      transition-all duration-500 hover:shadow-[0_35px_100px_rgba(0,0,0,0.25)]">

    {/* Header */}
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
        Add New Product
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        Manage your shop categories visually and easily.
      </p>
    </div>

    <form className="space-y-10" onSubmit={Submit_Handler}>

      {/* Category Name */}
      <div className="grid grid-cols-2 gap-2">
      <div className="group">
        <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-blue-600 transition">
          Product Name
        </label>

        <input
          ref={nameRef}
          onChange={create_slug}
          type="text"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4
            bg-gray-50 shadow-inner text-lg
            focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none
            transition-all duration-300 hover:bg-white"
          placeholder="e.g. Electronics"
        />
      </div>

      {/* Slug */}
      <div className="group">
        <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
          Product Slug
        </label>

        <input
          ref={slugRef}
          readOnly
          type="text"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4
            bg-gray-100 shadow-inner text-lg
            focus:ring-4 focus:ring-purple-300 focus:border-purple-600 outline-none
            transition-all duration-300"
          placeholder="Generated slug"
        />
      </div>
</div>

<div className="grid grid-cols-3 gap-2">
      <div className="group">
        <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-blue-600 transition">
          Original  Price
        </label>

        <input
          ref={originalPriceRef}
          onChange={calculateDiscount}
          type="number"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4
            bg-gray-50 shadow-inner text-lg
            focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none
            transition-all duration-300 hover:bg-white"
          placeholder="Enter original price"
        />
      </div>

      {/* Slug */}
      <div className="group">
        <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
          Final Price
        </label>

        <input
          ref={finalPriceRef   }
          
          onChange={calculateDiscount}
          type="number"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4
            bg-gray-100 shadow-inner text-lg
            focus:ring-4 focus:ring-purple-300 focus:border-purple-600 outline-none
            transition-all duration-300"
          placeholder="Enter Final Price"
        />
      </div>
      <div className="group">
        <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
          Discount Persantage
        </label>

        <input
          ref={discountPercentageRef}
          readOnly
          type="number"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4
            bg-gray-100 shadow-inner text-lg
            focus:ring-4 focus:ring-purple-300 focus:border-purple-600 outline-none
            transition-all duration-300"
        
        />
      </div>
</div>
<div className="grid grid-cols-3 gap-2.5">
  <div>
    <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
          Select a  Category
        </label>
        

<Select name="category_id" options={
  categories.map(
    (cat)=>{
return{
  value: cat._id,
  label:cat.name
}
    }
  )
}
></Select>

  </div>
  <div>
    <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
         Select a Color
        </label>
        <Select 
        onChange={onChangeHendler}
        isMulti={true} closeMenuOnSelect={false} options={
  colors.map(
    (cat)=>{
return{
  value: cat._id,
  label:cat.name
}
    }
  )
}
></Select>

  </div>
  <div>
    <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
          Select a Brand
        </label>
        <Select name="brand_id" options={
brands.map(
    (cat)=>{
return{
  value: cat._id,
  label:cat.name
}
    }
  )
}
></Select>

  </div>
</div>


<div className="w-5xl mx-auto">
<label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-purple-600 transition">
          Description
        </label>
        <Editor style={{minHeight:"200px"}} onTextChange={(d)=>setDecription(d.htmlValue)
        }/>
</div>
      {/* Image Upload */}
      <div>
        <label className="block text-gray-900 font-semibold mb-4 text-lg">
          Thumbnail
        </label>

        <FileUpload onFilesChange={getFile} className="m-5" maxSize={2*1024*1024} maxFiles={1}/>
      </div>
0
      {/* Submit Button */}
      <button
        className="w-full py-4 
          bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
          text-white text-xl rounded-2xl font-bold
          shadow-[0_10px_20px_rgba(0,0,0,0.25)]
          transition-all duration-300
          hover:opacity-90 active:scale-95"
      >
        Add Product
      </button>

    </form>

  </div>
</div>

  );
}