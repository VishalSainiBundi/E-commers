"use client";
import { toast } from "react-toastify";
import { useRef } from "react";
import { axiosApiInstrector } from "@/helper/helper";

export default function ColorEdit({ color }) {
  // अगर color null या undefined है तो ये मैसेज दिखाओ
  if (!color) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">
        Color not found.
      </div>
    );
  }

  const categoryRef = useRef();
  const colorRef = useRef();

  const notify = (msg, flag) =>
    toast(msg, { type: flag === 0 ? "success" : "error" });

  const Submit_Handler = (event) => {
    event.preventDefault();

    if (!categoryRef.current.value || !colorRef.current.value) {
      return notify("Please fill all fields", 1);
    }

    axiosApiInstrector
      .put(`color/update/${color.id}`, {
        name: categoryRef.current.value,
        code: colorRef.current.value,
      })
      .then((response) => {
        // console.log(response.data);
        notify(response.data.message, response.data.flag);
      })
      .catch((error) => {
        console.log(error);
        notify("Server error", 1);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-8">
      <div
        className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.2)] 
          rounded-[2.5rem] p-12 border border-white/40
          transition-all duration-500 hover:shadow-[0_35px_100px_rgba(0,0,0,0.25)]"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
            Edit Color
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Update your color data easily.</p>
        </div>

        <form className="space-y-10" onSubmit={Submit_Handler}>
          {/* Color Name */}
          <div className="group">
            <label className="block text-gray-700 font-semibold mb-3 text-lg">
              Color Name
            </label>
            <input
              ref={categoryRef}
              defaultValue={color.name}
              type="text"
              className="w-full rounded-2xl border border-gray-300 px-5 py-4
                bg-gray-50 shadow-inner text-lg
                focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none
                transition-all duration-300 hover:bg-white"
              placeholder="e.g. Red"
            />
          </div>

          {/* Color Code */}
          <div className="group">
            <label className="block text-gray-700 font-semibold mb-3 text-lg">
              Color Code
            </label>
            <input
              ref={colorRef}
              type="color"
              defaultValue={color.code}
              className="w-full h-16 rounded-2xl border border-gray-300 px-5 py-4
                shadow-inner cursor-pointer
                focus:ring-4 focus:ring-purple-300 focus:border-purple-600 outline-none
                transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 
              bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
              text-white text-xl rounded-2xl font-bold
              shadow-[0_10px_20px_rgba(0,0,0,0.25)]
              transition-all duration-300
              hover:opacity-90 active:scale-95"
          >
            Save Change
          </button>
        </form>
      </div>
    </div>
  );
}
