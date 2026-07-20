"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, changeQuantity } from "@/redux/reduceres/cartReducer";
import { removeFromWishlist } from "@/redux/reduceres/wishlistReducer";

export default function AddToCartButton(props) {
  // console.log("Propes",props)
  // Safe selector (prevents undefined crash)
  const cart_data = useSelector((store) => store.cart?.data || []);
  const dispatch = useDispatch();

  // Check if item already exists in cart
  const itemFound = cart_data.find((item) => item.id === props.id);

  // Add new item to cart
  const addHandler = () => {
    dispatch(addToCart({ ...props }));
    if (props.removeFromWishlist) dispatch(removeFromWishlist({ id: props.id }));
  };

  // Decrease quantity
  const decreaseHandler = () => {
    dispatch(changeQuantity({ ...props, flag: 0 }));
  };

  // Increase quantity
  const increaseHandler = () => {
    dispatch(changeQuantity({ ...props, flag: 1 }));
  };

  return (
    <>
      {itemFound ? (
        <div className="flex items-center gap-2">
          <button
            onClick={decreaseHandler}
            className="bg-teal-500 py-1 px-4 rounded-full font-bold text-white"
          >
            −
          </button>

          <span className="font-semibold">{itemFound.qty}</span>

          <button
          
            onClick={increaseHandler}
            className="bg-teal-500 py-1 px-4 rounded-full font-bold text-white"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={addHandler}
          disabled={props.disabled}
          className="flex-1 text-sm font-semibold px-3 py-2 rounded-full transition bg-teal-600 text-white"
        >
          {props.disabled ? "Out of Stock" : "Add To Cart"}
        </button>
      )}
    </>
  );
}
