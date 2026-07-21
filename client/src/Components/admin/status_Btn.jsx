'use client'
import React from "react";
import { axiosApiInstrector, notify } from "@/helper/helper";
import { useRouter } from "next/navigation";

const StatusBtn = ({ status, label,url,flag, className = "" }) => {
  const router= useRouter()

  // ✅ FIX (बस यही एक लाइन चाहिए)
  status = status === "true" || status === true;

  function getText() {
    if (label == "status") return status ? "Active" : "Inactive";
    if (label == "is_top") return status ? "Top Category" : "Not Top";
    if (label == "on_home") return status ? "Show Home" : "Hide Home";
    if (label == "is_hot") return status ? "Hot Product" : "Not Hot";
    if (label == "stock") return status ? "Stock" : "Out of Stock";
    if (label == "is_featured") return status ? "featured" : "Not featured";
    if (label == "is_best") return status ? "Best Category" : "Normal Category";
    

    return status ? "Active" : "Inactive";
  }
  function ToggelStatus(){
axiosApiInstrector.patch(`${url}`,{flag}).then(
  (response)=>{
notify(response.data.msg, response.data.flag)
if(response.data.flag == 0) {
    router.refresh();
}

  }
).catch(
  (error)=>{
    console.error(error)
  }
  )
  }

  return (
    <button
      onClick={ToggelStatus}
      className={`
        relative inline-flex items-center justify-center px-1 py-2 
        rounded-lg shadow-md text-[11px] font-medium  transition-all duration-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${status 
          ? "bg-blue-600 text-white hover:bg-blue-700" 
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"} 
        ${className}
      `}
    >
      {getText()}
    </button>
  );
};

export default StatusBtn;
