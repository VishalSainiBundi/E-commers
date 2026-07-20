import { getProduct } from "@/api-colls/product";
import { toLocalPrice } from "@/helper/helper";

const Home_Productcard = async () => {
  const ProductJson = await getProduct({ status: true, is_best: true });
  const Product = ProductJson.product || [];


const Save = (discount_presentage, final_price) => {
  // handle undefined or string values
  const discount = Number(String(discount_presentage || 0).replace("%","")) || 0;
  const price = Number(String(final_price || 0).replace(/[^0-9.]/g,"")) || 0;

  const Dis = (discount / 100) * price;
  return Dis.toFixed(2); // optional: 2 decimals
};

  

const other_img_Url="http://localhost:5000/img/product/other_image/"


  // console.log(Product, "Product");

  return (
    <div className="flex  gap-8 pt-15 shrink-0 flex-nowrap overflow-x-auto"> {/* Container for proper alignment */}
      {Product
      .filter((pr)=>pr.category_id?.name == "Leptop")
      .slice(0,5)
      .map((pr,ind) => {
        
 return (
          <div className="relative w-60" key={ind}>
            
            <div className="bg-[#01A49E]  rounded-md absolute text-white text-center top-[-20px]">
              
  Save {toLocalPrice(Save(pr.discount_presentage, pr.final_price))}
</div>

            {/* Product Image */}
            <img src={ProductJson.img_Url + pr.thumbnail} alt={pr.name} />

            {/* Card Icon */}
            <img
              src="img/card-dout.png"
              className="w-7 h-7 absolute left-40 top-[-45px]"
            />

            {/* Total Products */}
            <div className="w-6 ml-14 mb-4 text-[#666666] text-[13px] font-medium">
              ({pr.total_products})
            </div>

            {/* Product Name */}
            <div className="text-[14px] text-[#000000] font-bold">{pr.name}</div>

            {/* Price */}
            <h1 className="my-3 text-[18px] text-[#000000] font-bold">{toLocalPrice(pr.final_price)}</h1>

            {/* Buttons */}
            <button className="text-[#01A49E] rounded-md text-[12px] shadow-amber-200 mx-3">
              FREE SHIPING
            </button>
            <button className="text-[#01A49E] rounded-md text-[12px] shadow-amber-200">
              FREE GIFT
            </button>

            {/* Stock Info */}
            <div className="text-[#000000] text-[12px] font-medium flex gap-4 items-center mx-auto text-center mt-2.5">
              <img src="img/count.png" /> in stock
            </div>

            {/* Other Images */}
            <div className="gap-3.5 flex">
              
              <img src={other_img_Url+pr.other_images} className="w-10 h-10" />
              
            </div>
          </div>
        );
        
       
      })}
    </div>
  );
};

export default Home_Productcard;
