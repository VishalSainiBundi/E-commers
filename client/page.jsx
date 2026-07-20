import { Span } from "next/dist/trace";
import Image from "next/image";
const Data=[1,2,3,4]
const game=[1,2,3]
const link=[1,2,3,4,5,6,7,8,9,10]
const card=[1,2,3,4,5]
export default function Home() {
  return (
    <>
<div className="flex w-7xl mx-auto mt-1 ">
  <div className="w-[298px] shadow-[5px_5px_15px_0px_rgba(0,0,0,0.1)]
 border-1px border-[#ECECEC] rounded-[15px]">
<h1 className="border-1px border-[#ECECEC] py-4 px-2 text-[24px] font-medium mb-3 ">Category</h1>
<img src="img/after.png" className="mb-6"/>
{Data.map(
  ()=>{
    return(
      <ul className="mx-auto text-[13px] font-bold">
  <li className="flex p-5 border border-[#F2F3F4] my-4">
    <img src="img/Layer.png"/>
    <h1 className="ml-7">Laptops</h1>
    <img className="ms-auto" src="img/count.png"/>
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
<div className="w-7xl flex mx-auto mt-2 gap-6 bg-amber-400" >
  <div className=" p-3 rounded-[15px] w-[50%] bg-white">
<h1 className="text-[18px] font-bold flex justify-between"> FEAUTRED BRANDS <span className="text-[13px] text-[#666666] mr-5">View All </span></h1>

<div className="w-full flex flex-wrap gap-4 mt-5">
  
  {link.map(
    ()=>{
      return(
        
        <img src="img/link.png"/>
        
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
      Data.map(
        ()=>{
          return(
            <img src="img/product.png"/>
          )
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
      <div className="w-50%  flex items-center   " >
<div  className="">

  {
  Data.map(
    ()=>{
      return(
        <img src="img/p1.png" className="mt-5"/>
      )
    }
  )
  }
  </div>
  <img src="img/m-card.png"/>
  <img src="img/m-mobile.png"/>






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
    {game.map(
      ()=>{
        return(
          <img src="img/game.png" className="rounded-xl ml-5 my-2"/>
        )
      }
    )}
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
          {

            card.map(
              ()=>{
                return(
                  <div className=" relative w-60">
  <h1 className="bg-[#01A49E] w-20 h-13 rounded-md absolute text-white text-center top-[-45px]">
    save<br/>$199
  </h1>

  <img src="img/headphone.png"/>

  <img src="img/card-dout.png" className="w-7 h-7 absolute left-40 top-[-45px]"/>
  <div className="w-6 ml-14   mb-4 text-[#666666] text-[13px] font-medium">(152)</div>
<div className="   text-[14px] text-[#000000] font-bold">BOSO 2 Wireless On Ear
Headphone</div>
<h1 className="  my-3 text-[18px] text-[#000000] font-bold">$359.00</h1>

  <button className=" text-[#01A49E] rounded-md text-[12px] shadow-amber-200 mx-3">FREE SHIPING</button>
  <button className=" text-[#01A49E] rounded-md text-[12px] shadow-amber-200">FREE GIFT</button>
<div className="text-[#000000] text-[12px] font-medium flex gap-4 items-center mx-auto text-center mt-2.5"><img src="img/count.png"/> in stock</div>
<div className="gap-3.5 flex">
  <img src="img/headphone.png" className="w-10 h-10" />
  <img src="img/headphone.png" className="w-10 h-10" />

</div>
  
  
</div>
                )
              }
            )
          }



  
   <div className="w-10 h-10 mt-32 mr-5"> <img src="img/slide.png" width="40px" height="40px"/></div>

  </div>
</div>
</>
  );
} 