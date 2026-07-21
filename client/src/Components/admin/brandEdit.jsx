"use client";
import { toast } from "react-toastify";
import { useRef } from "react";
import { axiosApiInstrector, generateSlug } from "@/helper/helper";
import { useRouter } from "next/navigation";

const BrandEdit=({ brand, baseUrl })=> {
  const categoryRef = useRef();
  const slugRef = useRef();
  const router=useRouter()

  const notify = (msg, flag) =>
    toast(msg, { type: flag === 0 ? "success" : "error" });

  function create_slug() {
    slugRef.current.value = generateSlug(categoryRef.current.value);
  }

  const Submit_Handler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("Image", event.target.Image.files[0]);
    formData.append("name", categoryRef.current.value);
    formData.append("slug", slugRef.current.value);

    axiosApiInstrector
      .put("brand/update/"+brand._id, formData)
      .then((response) => {
        if (response.data.flag == 0) {
          notify(response.data.msg, response.data.flag);
          router.push("/admin/brand")
        }
      })
      .catch((error) => { if (process.env.NODE_ENV !== "production") console.error(error); });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7ff] via-[#e4e7ff] to-[#ebe5ff] flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-white/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.15)]
        rounded-3xl p-12 border border-white/50 
        transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,0,0,0.25)]
      ">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent drop-shadow">
            Edit Brand
          </h1>
          <p className="text-gray-600 mt-3 text-lg tracking-wide">
            Update your Brand details with a premium modern interface.
          </p>
        </div>

        <form className="space-y-10" onSubmit={Submit_Handler}>

          {/* Category Name */}
          <div>
            <label className="block font-bold text-gray-900 mb-2 text-lg">
              Brand Name
            </label>
            <input
              ref={categoryRef}
              onChange={create_slug}
              type="text"
              defaultValue={brand?.name}
              className="w-full rounded-2xl px-6 py-4 text-lg
                bg-white/50 border border-gray-300 backdrop-blur-xl shadow-inner
                focus:ring-4 focus:ring-blue-400 focus:border-blue-600 outline-none
                transition-all duration-300 hover:bg-white"
              placeholder="e.g. Electronics"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block font-bold text-gray-900 mb-2 text-lg">
              Slug
            </label>
            <input
              ref={slugRef}
              defaultValue={brand.slug}
              readOnly
              type="text"
              className="w-full rounded-2xl px-6 py-4 text-lg
                bg-gray-100/70 border border-gray-300 shadow-inner
                focus:ring-4 focus:ring-purple-300 outline-none transition"
            />
          </div>

          {/* Image Section */}
          <div>
            <label className="block font-bold text-gray-900 mb-3 text-lg">
              Brand Image
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Current Image */}
              <div className="relative group rounded-3xl overflow-hidden p-[2px]
                bg-gradient-to-br from-blue-500/60 via-purple-500/60 to-pink-500/60
                shadow-[0_0_40px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_0_60px_rgba(0,0,0,0.2)]
                backdrop-blur-xl"
              >
                <div className="rounded-3xl overflow-hidden bg-white/20 backdrop-blur-xl">
                  <img
                    src={baseUrl + brand.img}
                    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-[1deg]"
                  />
                </div>

                
              </div>

              {/* Upload New Image */}
            <label
  className="relative group flex flex-col items-center justify-center h-64 rounded-3xl cursor-pointer
    bg-gradient-to-br from-white/10 via-white/5 to-white/10
    backdrop-blur-3xl border border-white/20
    shadow-[0_15px_50px_rgba(0,0,0,0.15)]
    transition-all duration-700 ease-out overflow-hidden
    hover:shadow-[0_25px_70px_rgba(0,0,0,0.25)]
    hover:border-blue-400/60 hover:bg-white/20 hover:scale-[1.018]
    active:scale-[0.98]"
>

  {/* Multi-layer neon aura glow */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br 
      from-blue-600/20 via-purple-600/20 to-pink-600/20
      opacity-0 group-hover:opacity-100 blur-2xl 
      transition-all duration-700 ease-out pointer-events-none">
  </div>

  {/* Circular glowing center aura */}
  <div className="absolute h-40 w-40 rounded-full bg-gradient-to-br
      from-blue-500/15 via-purple-500/15 to-pink-500/15
      blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-700">
  </div>

  {/* Inner floating glass layer */}
  <div className="absolute inset-3 rounded-[1.8rem]
      bg-white/10 border border-white/20 shadow-inner backdrop-blur-3xl"></div>

  {/* Content */}
  <div className="relative z-20 flex flex-col items-center gap-4">

    {/* Floating Icon Orb */}
    <div className="p-5 rounded-full bg-white/20 backdrop-blur-xl border border-white/40
      shadow-[0_0_25px_rgba(0,0,0,0.08)]
      transition-all duration-700 group-hover:scale-125 group-hover:bg-white/30 
      group-hover:border-blue-500/60">

      <svg
        className="w-12 h-12 text-gray-700 transition-all duration-700 
          group-hover:text-blue-600 group-hover:drop-shadow-[0_0_12px_rgb(59,130,246)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12 12 7.5m0 0L16.5 12M12 7.5V18"
        />
      </svg>
    </div>

    {/* Text */}
    <p className="text-lg font-semibold tracking-wide text-gray-900 
      group-hover:text-blue-700 transition-all duration-500">
      Upload New Image
    </p>

    <p className="text-sm text-gray-700 opacity-80 group-hover:opacity-100 transition-all duration-500">
      Click to browse file
    </p>

  </div>

  <input type="file" name="Image" className="hidden" />
</label>

            </div>
          </div>

          {/* Button */}
          <button
            className="w-full py-4 text-xl font-bold text-white rounded-2xl
              bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
              shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-95"
          >
            Save Changes
          </button>

        </form>

      </div>
    </div>
  );
}

export default BrandEdit
