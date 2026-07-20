import { getProduct } from "@/api-colls/product";
import ListingHeader from "@/components/website/ListingHeader";
import ProductCardStore from "@/components/website/ProductCart2";
import SideBar from "@/components/website/SideBar";

/* =========================   Store Page Component ========================= */
export default async function Page({ searchParams }) {
  const params = await searchParams; // ✅ FIX: unwrap promise

  const query = { status: true };

  if (params?.brand_ids) query.brand_ids = params.brand_ids;
  if (params?.color_ids) query.color_ids = params.color_ids;
  if (params?.sortby) query.sortby = params.sortby;
  if (params?.limit) query.limit = params.limit;

  console.log("query", query);

  const productJSON = await getProduct(query);

  const productData = productJSON?.product || [];
  const productImg = productJSON?.img_Url || "";

  const featuredProducts = productData.filter(
    (product) => product.is_featured
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3">
        <SideBar />
      </aside>

      {/* Main Content */}
      <main className="col-span-12 lg:col-span-9 space-y-10">
        {featuredProducts.length > 0 && (
          <FeaturedSection
            featuredProducts={featuredProducts}
            imgUrl={productImg}
          />
        )}

        <section className="space-y-6">
          <ListingHeader />
          <ProductListing
            productData={productData}
            productImg={productImg}
          />
        </section>
      </main>
    </div>
  );
}

/* =========================   Featured Products Section ========================= */
function FeaturedSection({ featuredProducts, imgUrl }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCardStore
            key={product._id}
            {...product}
            img={`${imgUrl}${product.thumbnail}`}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================   Product Listing Section ========================= */
function ProductListing({ productData, productImg }) {
  if (!productData.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center border">
        <h3 className="text-xl font-semibold text-slate-800">
          No products found
        </h3>
        <p className="text-slate-500 mt-2">
          Try adjusting filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {productData.map((product) => (
        <ProductCardStore
          key={product._id}
          {...product}
          img={`${productImg}${product.thumbnail}`}
        />
      ))}
    </div>
  );
}




**//HEader**//
//"use client";

// 


{/* <div className="flex items-center justify-center min-w-[3rem] h-8 px-2 bg-teal-600 text-white text-xs font-semibold rounded-full shadow-sm">
  16,789.00
</div> */}


/*User Auth*/

"use client";

import { axiosApiInstrector, notify } from "@/helper/helper";
import { setData } from "@/redux/reduceres/userReducer";
import store from "@/redux/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function UserAuth() {
  
  const searchParams=  useSearchParams() 
const cart= useSelector(store=> store.cart)
  const dispatcher= useDispatch()
  const route=useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // SIGN IN
  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    console.log("Login Data:", data);
  };

  // SIGN UP
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
    passwoard: e.target.passwoard.value,
      email: e.target.email.value,
    };
    
axiosApiInstrector.post("user/login",data).then(
  (success)=>{
  // console.log(success.data)
if(success.data.flag==0){
notify(success.data.msg,0)


axiosApiInstrector.post(
  "/cart/sync-cart",
  {
    cart_data:cart?.data?.length==0 ? [] : cart?.data,
    user_id:success.data.user._id,
  }
).then( ()=>
  {
dispatcher(setData({user:success.data.user}))
if(searchParams.get("redirect")){
  
    route.push(searchParams.get("redirect"))
}
else{
route.push("/")
  
}
  }
).catch(()=>{})



}else{
notify(success.data.msg,1)

}
  }
).catch(
  (error)=>{

  }
)



    // console.log("Register Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6">
          <img src="img/login.png" alt="auth" />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">

          {/* Toggle */}
          <div className="flex bg-gray-200 rounded-lg mb-6">
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-lg font-semibold ${
                !isLogin ? "bg-teal-500 text-white" : "text-gray-600"
              }`}
            >
              Sign Up
            </button>
            <button
            type="submit"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-lg font-semibold ${
                isLogin ? "bg-teal-500 text-white" : "text-gray-600"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            {isLogin ? "Sign in to continue" : "Join us today"}
          </p>

          {/* ================= SIGN IN FORM ================= */}
          {isLogin && (
            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="passwoard"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button className="w-full bg-teal-500 text-white py-2 rounded-lg">
                Sign In
              </button>
            </form>
          )}

          {/* ================= SIGN UP FORM ================= */}
          {!isLogin && (
            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <button className="w-full bg-teal-500 text-white py-2 rounded-lg">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

//

// New USer Auth




"use client";

import { axiosApiInstrector, notify } from "@/helper/helper";
import { setData } from "@/redux/reduceres/userReducer";
import store from "@/redux/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function UserAuth() {
  
    const  img_Url= "http://localhost:5000/img/product/main-image/"


  const searchParams=  useSearchParams() 
const cart= localStorage.getItem("cart") !=null ? JSON.parse( localStorage.getItem("cart")) :[]
  const dispatcher= useDispatch()
  const route=useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // SIGN IN
  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    console.log("Login Data:", data);
  };

  // SIGN UP
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
    passwoard: e.target.passwoard.value,
      email: e.target.email.value,
    };
    
axiosApiInstrector.post("user/login",data).then(
  (success)=>{
  // console.log(success.data)
if(success.data.flag==0){
notify(success.data.msg,0)

axiosApiInstrector.post(
  "/cart/sync-cart",
  {
    cart_data:cart,
    user_id:success.data.user._id,
  }
).then( (response)=>
  {
    if(response.data.flag==0){
      let final_total=0,
      original_total=0;
      const cartData= response?.data?.finalCart?.map(
        (cart_Item)=>{
const final_total=cart_Item.quantity*cart_Item.product_id.final_price
const original_total=cart_Item.quantity*cart_Item.product_id.original_price
        return{
          id:cart_Item.product_id.id,
          name:cart_Item.product_id.name,
          qty:cart_Item.quantity,
          imgUrl:img_Url+cart_Item.product_id.thumbnail,
          original_price:cart_Item.product_id.original_price,
          final_price:cart_Item.product_id.final_price
        }
        }
      )
      localStorage.setItem("cart",JSON.stringify({data:cartData, original_total, final_total}))
dispatcher(setData({user:success.data.user}))
    
    
if(searchParams.get("redirect")){
  
    route.push(searchParams.get("redirect"))
}
else{
route.push("/")
  
 }
  }
}
).catch(()=>{})



}else{
notify(success.data.msg,1)

}
  }
).catch(
  (error)=>{

  }
)



    // console.log("Register Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6">
          <img src="img/login.png" alt="auth" />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">

          {/* Toggle */}
          <div className="flex bg-gray-200 rounded-lg mb-6">
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-lg font-semibold ${
                !isLogin ? "bg-teal-500 text-white" : "text-gray-600"
              }`}
            >
              Sign Up
            </button>
            <button
            type="submit"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-lg font-semibold ${
                isLogin ? "bg-teal-500 text-white" : "text-gray-600"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            {isLogin ? "Sign in to continue" : "Join us today"}
          </p>

          {/* ================= SIGN IN FORM ================= */}
          {isLogin && (
            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="passwoard"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button className="w-full bg-teal-500 text-white py-2 rounded-lg">
                Sign In
              </button>
            </form>
          )}

          {/* ================= SIGN UP FORM ================= */}
          {!isLogin && (
            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <button className="w-full bg-teal-500 text-white py-2 rounded-lg">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

























"use client";

import { axiosApiInstrector, notify } from "@/helper/helper";
import { setData } from "@/redux/reduceres/userReducer";
import store from "@/redux/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function UserAuth() {

  const img_Url = "http://localhost:5000/img/product/main-image/"


  const searchParams = useSearchParams()
  const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : { data: [] }
  const dispatcher = useDispatch()
  const route = useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // SIGN IN
  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    console.log("Login Data:", data);
  };

  // SIGN UP
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      password: e.target.password.value,
      email: e.target.email.value,
    };

    axiosApiInstrector.post("user/login", data).then(
      (success) => {

        if (success.data.flag == 0) {
          notify(success.data.msg, 0)
          console.log({
            cart_data: cart != null ? cart.data : [],
            user_id: success.data.user._id,
          });

          axiosApiInstrector.post(
            "/cart/sync-cart",
            {
              cart_data: cart?.data,
              user_id: success.data.user._id,
            }
          ).then((response) => {
            if (response.data.flag == 0) {
              let final_total = 0,
                original_total = 0;
              const cartData = response?.data?.finalCart?.map(
                (cart_Item) => {
                  const final_total = cart_Item.quantity * cart_Item.product_id.final_price
                  const original_total = cart_Item.quantity * cart_Item.product_id.original_price
                  return {
                    id: cart_Item.product_id.id,
                    name: cart_Item.product_id.name,
                    qty: cart_Item.quantity,
                    imgUrl: img_Url + cart_Item.product_id.thumbnail,
                    original_price: cart_Item.product_id.original_price,
                    final_price: cart_Item.product_id.final_price
                  }
                }
              )
              localStorage.setItem("cart", JSON.stringify({ data: cartData, original_total, final_total }))
              dispatcher(setData({ user: success.data.user }))


              if (searchParams.get("redirect")) {

                route.push(searchParams.get("redirect"))
              }
              else {
                route.push("/")

              }
            }
          }
          ).catch(() => { })



        } else {
          notify(success.data.msg, 1)

        }
      }
    ).catch(
      (error) => {

      }
    )



    // console.log("Register Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6">
          <img src="img/login.png" alt="auth" />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">

          {/* Toggle */}
          <div className="flex bg-gray-200 rounded-lg mb-6">
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-lg font-semibold ${!isLogin ? "bg-teal-500 text-white" : "text-gray-600"
                }`}
            >
              Sign Up
            </button>
            <button
              type="submit"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-lg font-semibold ${isLogin ? "bg-teal-500 text-white" : "text-gray-600"
                }`}
            >
              Sign In
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            {isLogin ? "Sign in to continue" : "Join us today"}
          </p>

          {/* ================= SIGN IN FORM ================= */}
          {isLogin && (
            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button className="w-full bg-teal-500 text-white py-2 rounded-lg">
                Sign In
              </button>
            </form>
          )}

          {/* ================= SIGN UP FORM ================= */}
          {!isLogin && (
            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <button className="w-full bg-teal-500 text-white py-2 rounded-lg">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}














import { getProduct } from "@/api-colls/product";

const Home_Productcard = async () => {
  const ProductJson = await getProduct({ status: true, is_best: true });
  const Product = ProductJson.product || [];
  // console.log(Product, "Product");

  return (
    <div className="relative w-60 flex items-center gap-10">
      

      {Product.map((pr, ind) => {
        if (pr.is_best==true) {
          return (
            <div key={ind} >
              <h1 className="bg-[#01A49E] w-20 h-13 rounded-md absolute text-white text-center top-[-45px]">
        save
        <br />
        $199
      </h1>
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
              <h1 className="my-3 text-[18px] text-[#000000] font-bold">$359.00</h1>
              {/* Buttons */}
              <button className="text-[#01A49E] rounded-md text-[12px] shadow-amber-200 mx-3">
                FREE SHIPING
              </button>
              <button className="text-[#01A49E] rounded-md text-[12px] shadow-amber-200">
                FREE GIFT
              </button>
               <div className="text-[#000000] text-[12px] font-medium flex gap-4 items-center mx-auto text-center mt-2.5">
        <img src="img/count.png" /> in stock
      </div>
      <div className="gap-3.5 flex">
        <img src="img/headphone.png" className="w-10 h-10" />
        <img src="img/headphone.png" className="w-10 h-10" />
      </div>
            </div>
          );
        }
        return null; // Important: return null for non-best products
      })}

      {/* Stock Info */}
     

      {/* Other Images */}
      
    </div>
  );
};

export default Home_Productcard;




const getOrderById = (req, res) => {
  // Logic to get an order by ID
};

const updateOrder = (req, res) => {
  // Logic to update an order
};

const deleteOrder = (req, res) => {
  // Logic to delete an order
};

const getAllOrders = (req, res) => {
  // Logic to get all orders
};

const sendOrderConfirmationEmail = async (order) => {
  const user = await UserModel.findById(order.userId);
  if (user.email != null || user.email != "") {
    
  }
}