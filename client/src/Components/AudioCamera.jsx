import { getProduct } from "@/api-colls/product";
import AddToCartButton from "./website/AddToCartButton";

const AudioCamerasCard = async () => {

    const ProductJson=await getProduct({status:true})
    const product = ProductJson.product 
  return (
    <div className="w-[360px] bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase">
          Audios & Cameras
        </h2>
        <button className="text-xs text-gray-500 hover:text-gray-800">
          View All
        </button>
      </div>

      {/* Banner */}
      <div className="relative bg-[#0B1C3D] rounded-lg overflow-hidden mb-6">
        <div className="p-4 text-white">
          <p className="text-sm font-semibold leading-tight">
            Best<br />Speaker<br />2026
          </p>
        </div>

        <img
          src="img/speaker.webp"
          alt="Best Speaker"
          className="absolute right-2 bottom-0 w-30 h-20 object-contain"
        />
      </div>

      
      <div className="grid grid-cols-2 gap-6">
        
      {product
  .filter((pr) => pr.category_id?.name == "Speaker" && pr.on_home)
  .slice(0, 4)
  .map((pr, ind) => (
    <div
      key={ind}
      className="flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
        <img
          src={ProductJson.img_Url + pr.thumbnail}
          className="w-15"
          alt={pr.name}
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-900">
        {pr.name}
      </h3>
      <p className="text-xs text-gray-500">
        {pr.total_products}
      </p>
      <AddToCartButton/>
    </div>
  ))}


      </div>
    </div>
  );
};

export default AudioCamerasCard;
