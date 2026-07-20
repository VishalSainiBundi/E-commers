"use client";

import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/redux/reduceres/wishlistReducer";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AddToWishButton(props) {
  const dispatch = useDispatch();
  const router=useRouter()

  // Redux से wishlist डेटा लेना
  const wish_data = useSelector((store) => store.wish?.data || []);

  // Check करें कि item पहले से wishlist में है या नहीं
  const isInWishlist = wish_data.some((item) => item.id === props.id);

  // Toggle handler: अगर है तो remove, नहीं है तो add
  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({ id: props.id }));
    } else {
      dispatch(addToWishlist({ ...props }));
      router.push("/wishlist")
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-4 right-4 text-slate-300 hover:text-teal-500 transition"
    >
      <FaHeart className={isInWishlist ? "text-red-600" : ""} size={20} />
    </button>
  );
}
