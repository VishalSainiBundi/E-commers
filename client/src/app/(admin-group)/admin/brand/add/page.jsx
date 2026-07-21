"use client";
import { toast } from "react-toastify";
import { useRef } from "react";
import { axiosApiInstrector, generateSlug,notify } from "@/helper/helper";



export default function AddBrand() {
  const categoryRef = useRef();
  const slugRef = useRef();
  const notify = (msg, flag) =>
    toast(msg, { type: flag == 0 ? "success" : "error" });


  function create_slug() {
    const slug = generateSlug(categoryRef.current.value);
    slugRef.current.value = slug;
  }

  const Submit_Handler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Image", event.target.Image.files[0]),
      formData.append("name", categoryRef.current.value),
      formData.append("slug", slugRef.current.value)



    axiosApiInstrector.post("brand/create", formData)
      .then((response) => {
        // console.log(response.data)
          notify(response.data.msg, response.data.flag);

        if (response.data.flag == 0) {
        }

      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-8">

  <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.2)] 
      rounded-[2.5rem] p-12 border border-white/40
      transition-all duration-500 hover:shadow-[0_35px_100px_rgba(0,0,0,0.25)]">

    {/* Header */}
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
        Add Brand
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        Manage your shop categories visually and easily.
      </p>
    </div>

    <form className="space-y-10" onSubmit={Submit_Handler}>

      {/* Category Name */}
      <div className="group">
        <label className="block text-gray-700 font-semibold mb-3 text-lg group-hover:text-blue-600 transition">
          Brand Name
        </label>

        <input
          ref={categoryRef}
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
          Brand Slug
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

      {/* Image Upload */}
      <div>
        <label className="block text-gray-900 font-semibold mb-4 text-lg">
          Brand Image
        </label>

        <label
          className="relative flex flex-col items-center justify-center w-full h-72
            rounded-3xl cursor-pointer overflow-hidden
            bg-gradient-to-br from-white/40 to-white/20
            backdrop-blur-xl border border-white/40
            shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            transition-all duration-700 ease-out
            hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)]
            group"
        >

          {/* Glow Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md"></div>

          {/* Inner Layer */}
          <div className="absolute inset-[3px] rounded-[2.3rem] bg-white/60 backdrop-blur-xl"></div>

          {/* Text */}
          <p className="relative z-10 text-gray-700 font-medium text-xl group-hover:scale-105 transition-all">
            Click to upload image
          </p>

          <input type="file" className="hidden" name="Image" />
        </label>
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-4 
          bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
          text-white text-xl rounded-2xl font-bold
          shadow-[0_10px_20px_rgba(0,0,0,0.25)]
          transition-all duration-300
          hover:opacity-90 active:scale-95"
      >
        Add Brand
      </button>

    </form>

  </div>
</div>

  );
}