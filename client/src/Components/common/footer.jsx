const  Footer=()=>{
return(
    <>
    <div className="w-7xl mx-auto flex mt-15  bg-gray-200  p-2.5 justify-around">

<div className=" text-[#000000] text-[18px]  items-center">
    <h1 className="font-bold mb-2.5"> Swoo - 1st NYC tech online market</h1>
     <ul>
        <li className="text-[14px] font-normal"> Hotline 24/7</li>
        <li className="text-[#E15E43] font-bold  text-[30px] mt-[-10px] mb-4">(025) 3686 25 16</li>
        <li className="font-normal text-[14px]">257 Thatcher Road St, Brooklyn, Manhattan,<br/>
NY 10092</li>
<li className="text-[14px] font-normal mt-[-5px]">contact@Swootechmart.com</li>
<li className="flex mt-5 gap-3">
    <img src="img/twiter.png"/>
    <img src="img/facebook.png"/>
    <img src="img/insta.png"/>
    <img src="img/youtube.png"/>
    <img src="img/ad.png"/>
</li>

     </ul>
</div>
<div>
    <h1 className="font-bold text-[18px] text-[#000000] mb-2.5">Top Categories</h1>
    <h1 className="text-[#666666] text-[14px]">Laptops<br/>
PC & Computers<br/>
Cell Phones<br/>
Tablets<br/>
Gaming & VR<br/>
networks<br/>
Cameras<br/>
Sounds<br/>
Office</h1>
</div>
<div >
    <h1 className="font-bold text-[18px] text-[#000000] mb-2.5">COMPANY</h1>
    <h1 className="text-[#666666] text-[14px]">About Swoo<br/>
Contact<br/>
Career<br/>
Blog<br/>
Sitemap<br/>
Store Locations</h1>
</div>
<div >
    <h1 className="font-bold text-[18px] text-[#000000] mb-2.5">HELP CENTER</h1>
    <h1 className="text-[#666666] text-[14px]">Customer Service<br/>
Policy<br/>
Terms & Conditions<br/>
Trach Order<br/>
FAQs<br/>
My Account<br/>
Product Support</h1>
</div>
<div >
    <h1 className="font-bold text-[18px] text-[#000000] mb-2.5">PARTENR</h1>
    <h1 className="text-[#666666] text-[14px]">Become Seller<br/>
Affiliate<br/>
Advertise<br/>
Partnership</h1>
</div>
</div> 
<div className="w-7xl flex mx-auto mt-11 items-center justify-around">
<div className="text-[14px] font-normal flex  gap-7">

<select  name="INP" id="INP" className="border-none border-[1px] border-[#99999933] rounded-lg p-2">
    <option value="">IND</option>
    <option value="">AST</option>
    <option value="">NEP</option>
    <option value="">USA</option>
</select>
<span className="flex gap-2">
    <img src="img/logo.png" width="15px" height="15px"/>
    <>
    <select name="eng" id="eng">
        <option value="eng">Eng</option>
        <option value="eng">Hin</option>
        <option value="eng">Fran</option>
        <option value="eng">Germ</option>


    </select>
    </>

</span>

</div>
<div className="font-bold text-[18px] text-[#000000] mr-50" >
    SUBSCRIBE & GET <span className="text-[#E15E43]">10% OFF</span> FOR YOUR FIRST ORDER
</div>


</div>
<div className="w-5xl mx-auto text-gray-400 flex mt-10 ">
    <input type="text" placeholder="Enter Your Email address..." className="flex-1 ms-auto ml-95 mr-7 "/>
    <button className="text-[#E15E43] font-bold text-[14px] ml-40">SUBSCRIBR</button>
</div>
<hr className="w-2xl ms-auto mr-60 bg-gray-200 m-1" />
<div className="font-normal text-[13px] w-7xl mx-auto text-[#666666] text-center">By subscribing, you’re accepted the our <span className="">Policy</span></div>

<div className="w-7xl mx-auto  mt-15 flex justify-between">
    
        <div className="font-normal text-[14px]">© 2024 <span className="font-bold">Shawonetc3 </span>. All Rights Reserved</div>
        <div className="flex gap-7">
            <img src="img/pay.png"/>
             <img src="img/pay2.png "/>
            <img src="img/visa.png"/>
            <img src="img/strip.png"/>
            <img src="img/kpay.png"/> 
        </div>
        <div className="font-normal text-[14px] text-[#0D6EFD]"> Mobile Site</div>
    
</div>
</>
)
}

export default Footer