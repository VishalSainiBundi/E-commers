import { Span } from "next/dist/trace";
import Image from "next/image";
import Productcard from "@/Components/website/card";
import { getCategory } from "@/api-colls/category";
import { getBrand } from "@/api-colls/brand";
import { getProduct } from "@/api-colls/product";
import Home_ProductCard from "@/Components/website/TabCard";
import AudioCamerasCard from "@/Components/AudioCamera"
import ProjectorCard from"@/Components/website/Project"
import GameCard from "@/Components/website/Gaming";
import HomeChair from "@/Components/website/Chair";
import { toLocalPrice } from "@/helper/helper";

const other_img_Url="http://localhost:5000/img/product/other_image/"

export default async function Home() {
const categoryJson= await getCategory({status:true})
const category = categoryJson.category
const TOPcategoryJson = await getCategory({is_top:true, status:true})
const TOPcategory = TOPcategoryJson.category


const BrandJson= await getBrand({status:true})
const brand = BrandJson.brand

const productJson= await getProduct({status:true})
const product = productJson.product

const TopProductJson= await getProduct({status:true, is_top:true})
const TopProduct= TopProductJson.product
// console.log("brand",brand)

// console.log(category,"category")

  return (
    <>
<div className="flex w-7xl mx-auto mt-1 ">
  <div className="w-[298px] shadow-[5px_5px_15px_0px_rgba(0,0,0,0.1)]
 border-1px border-[#ECECEC] rounded-[15px]">
<h1 className="border-1px border-[#ECECEC] py-4 px-2 text-[24px] font-medium  ">Category</h1>
<img src="img/after.png" className="mb-4"/>
{category

.filter((cat)=>cat.on_home)
.slice(0,5)
.map(
  (cat,ind)=>{
    return(
      <ul className="mx-auto text-[13px] font-bold " key={ind}>
  <li className="flex p-5 border border-[#F2F3F4] my-1" key={ind}>
    <img  src={categoryJson.img_Url+cat.img} className="w-10"/>
    <h1 className="ml-7">{cat.name}</h1>
<h1 className="ml-7 text-teal-500">{cat.CatCount}</h1>
  </li>
</ul>

    )
  }
)} 
</div>
  <div className="flex-1 pl-10">
    <img src="img/Tabpanel.png"/>
  </div>
</div>
<div className="w-7xl flex mx-auto mt-2 gap-6 " >
  <div className=" p-3 rounded-[15px] w-[50%] bg-white">
<h1 className="text-[18px] font-bold flex justify-between"> FEAUTRED BRANDS <span className="text-[13px] text-[#666666] mr-5">View All </span></h1>

<div className="w-full flex flex-wrap gap-4 mt-5">
  
  {brand
  .filter((bd)=> bd.is_featured )
    .slice(0,5)
  .map(
    
    (bd,ind)=>{
      return(
        
        <img src={BrandJson.img_Url+bd.img} key={ind} className="w-20"/>
        
      )
    }
  )
}
</div>
  </div>
<div className="p-3 rounded-[15px] w-[50%] bg-white">
  <h1 className="text-[18px] font-bold flex">TOP CATEGORIES<span className="text-[13px] text-[#666666] ml-15 mt-2">View All </span><img src="img/arrows.png" className="ml-60" /></h1>
  <div className="flex justify-around mt-10">
    {
      TOPcategory
      
    .slice(0,5)
      .map(
        (cat,ind)=>{
          if(cat.is_top==true){
          return(
            <img src={TOPcategoryJson.img_Url+cat.img} key={ind} className="w-20"/>
          )
        }
      }
      )
    }
  </div>
</div>
</div>
<div className="w-7xl flex  mx-auto mt-5">
  <div className="w-[70%] ">
    <div className="w-full bg-[#01A49E]  flex items-center">
    <h1 className="text-[18px] text-[#FFFFFF] font-bold ml-4">Deals of the day</h1>
    <span className="text-[#FFFFFF] ml-160">e<br/>w<br/>A</span>
    </div>
    <div className="w-full flex  p-2">
      <div className="w-50%  flex items-center  mt-50 " >
<div  className="">
{
  product
  .filter(pro=> pro.is_hot)
  .slice(0,5)
  .map(
    
    (pro,ind)=>{
      if(pro.is_hot==true)
        
      return(
        
               <img src={other_img_Url+pro.other_images} className="w-10 h-10 mt-5" key={ind}/>
    
      )
    }
  )
  }
  {
  product
  .filter(pro=> pro.is_hot)
  .slice(0,1)
  .map(
    
    (pro,ind)=>{
      if(pro.is_hot==true)
        
      return(
        <>
               
               <img src={productJson.img_Url+pro.thumbnail} className="w-110 ml-10 mr-8 pb-10 -mt-75"/>
      </>
      )
    }
  )
  }
  </div>
  
  






      </div>
      <div className="flex-1 mt-10">

        <h1 className="text-[16px] font-bold">Xioma Redmi Note 11 Pro 256GB 2023, Black
Smartphone</h1>
<div className="text-[22px] font-bold text-[#01A49E] my-4">569.00<span className="text-[#666666]">769</span></div>
<ul className="text-[12px] font-medium">
  <li className="mt-2"> Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core</li>
  <li className="mt-2"> DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory</li>
  <li className="mt-2"> Commanding Power Design: Twin 16+1+2 Phases Digital VRM</li>

</ul>
<div className="flex gap-7  mt-2.5">
  <button className=" text-[#01A49E] rounded-md text-[14px] shadow-amber-200">FREE SHIPING</button>
  <button className=" text-[#01A49E] rounded-md text-[14px] shadow-amber-200">FREE GIFT</button>

</div>
<div className="flex gap-1.5 mt-7 items-center">
  <h1 className="text-[13px] font-medium">HURRY UP!PROMOTION WILLEXPIRES IN</h1>
  <img src="img/A-c4.png"/>
  <img src="img/A-c3.png"/>
  <img src="img/A-c2.png"/>
  <img src="img/A-c1.png"/>

</div>
<img src="img/range.png" className="mt-8"/>
      </div>

    </div>
  </div>
  <div className="flex-1">
    {product
  .filter(pr => pr.is_hot && pr.is_best) 
  .slice(0, 3)                           
  .map((pr, ind) => (
    <img
      key={pr._id || ind}
      src={productJson.img_Url + pr.thumbnail}
      className="rounded-xl ml-5 my-2 w-72 h-44"
      alt={pr.name}
    />
  ))
}

  </div>
</div>
<div  className="w-7xl  mx-auto mt-[-18px]">
<img src="img/Main-Tab.png" width="100%"/>
</div>
<div className="w-7xl mx-auto mt-8">
  <h1 className="items-center text-[18px] font-semibold text-[#000000]">BEST SELLER <span className="font-normal ml-8">NEW IN</span> <span className="ml-8 font-normal">POPULAR</span><span className="text-[13px] ml-215 font-normal">view</span></h1>
  {/* Card */}

  <div className="w-full flex pt-20 px-2">
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>
  
                  <Productcard />
 
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>

  </div>
</div>



<div className="w-7xl mx-auto MT-2">
<div className="w-full justify-between flex mt-7 MB-2 p-4 bg-gray-100">
  <h1 className="font-bold text-[#000000] text-[18px] ">BEST CELLPHONE & TABALETS</h1>
  <h1 className=" text-[#666666] text-[13px] font-medium">View All </h1>
</div>
<div className="flex w-full">
<div className="w-[50%] rounded-xl flex bg-[rgb(26,25,28)] justify-around">
  {
    product
    .filter(pr=> pr.category_id?.name === "Mobile")
    .slice(0,1)
    .map(
      (pr,ind)=>{
        
        return(
          <>
          <div className="text-[#FFFFFF] text-[30px] font-bold pt-5 pl-4">
  {pr.name}<br />
  superchard <br />
  <div className="font-medium">By My 2</div>
  <h1 className="text-[20px] font-bold ">Start from <span className=" text-blue-600">{toLocalPrice(pr.final_price)}</span></h1>
</div>
<img src={productJson.img_Url+pr.thumbnail} className="w-55 py-5 rounded-[50px]"  />
</>
        )
      }
      
    )
  }

  
</div>

<div className="flex-1 ml-1 flex flex-wrap -2 py-2.5">
           <div className="grid grid-cols-3 gap-y-10 px-2 md:grid-cols-6 md:px-8">

  {
    product
    .filter(pr=> pr.category_id?.name === "Mobile")
    .slice(0,4)
    .map(
      (pr,ind)=>{
        return(
      
        <>
          <img
            src={
productJson.img_Url+pr.thumbnail
            }
            alt={pr.name}
            className="w-20  object-contain"
            loading="lazy"
          />
          <h3 className="text-sm font-semibold">{pr.name}</h3>
          <p className="text-xs text-gray-500">{productJson.total_products} Items</p>
    
</>
        )
      }
    )
  }
  

    </div>










  
</div>

</div>
</div>

<div className="w-7xl mx-auto flex pt-20 px-2">
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>
  
                  <Productcard />
  



  
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>

  </div>





<div className="w-7xl mx-auto">
<div className="w-full justify-between flex mt-5 p-4 bg-gray-100">
  <h1 className="font-bold text-[#000000] text-[18px] ">Best Laptops & Computers</h1>
  <h1 className=" text-[#666666] text-[13px] font-medium">View All </h1>
</div>
<div className="flex w-full">
<div className="w-[50%] rounded-xl flex bg-[#2A2A2A] justify-around">
  {
    product
    .filter(pr=> pr.category_id?.name === "Leptop")
    .slice(0,1)
    .map(
      (pr,ind)=>{
        
        return(
          <>
          <div className="text-[#FFFFFF] text-[30px] font-bold pt-5 pl-4">
  {pr.name}<br />
  superchard <br />
  <div className="font-medium">By My 2</div>
  <h1 className="text-[20px] font-bold ">Start from <span className=" text-blue-600">{toLocalPrice(pr.final_price)}</span></h1>
</div>
<img src={productJson.img_Url+pr.thumbnail} className="w-55 py-5 rounded-[50px]"  />
</>
        )
      }
      
    )
  }

  
</div>

<div className="flex-1 ml-1 flex flex-wrap -2">
           <div className="grid grid-cols-3 gap-y-10 px-2 md:grid-cols-6 md:px-8">

  {
    product
    .filter(pr=> pr.category_id?.name === "Leptop")
    .slice(0,4)
    .map(
      (pr,ind)=>{
        return(
      
        <>
          <img
            src={
productJson.img_Url+pr.thumbnail
            }
            alt={pr.name}
            className="w-20  object-contain"
            loading="lazy"
          />
          <h3 className="text-sm font-semibold">{pr.name}</h3>
          <p className="text-xs text-gray-500">{productJson.total_products} Items</p>
    
</>
        )
      }
    )
  }
  

    </div>










  
</div>

</div>
</div>
<div className="w-7xl mx-auto flex pt-20 px-2">
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>
  
                  <Home_ProductCard />
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>

  </div>

<div className="w-7xl mx-auto mt-8 flex justify-between">
  
<AudioCamerasCard/>
<ProjectorCard/>
<GameCard/>

</div>
<div className="w-7xl mx-auto">
  <HomeChair/>
</div>
</>



  );
} 