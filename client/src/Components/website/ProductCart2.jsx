import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
// import { FaHeart } from "react-icons/fa";
import AddToWishButton from "./AddWishlist";

const ProductCardStore=({
  _id,
  img,
  name,
  original_price,
  discount_percentage,
  final_price,
  stock,
}) =>{
  return (
    <article className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 space-y-4 relative transition hover:shadow-xl">
      {/* Discount Badge */}
      {discount_percentage > 0 && (
        <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {discount_percentage}% OFF
        </span>
      )}

      {/* Wishlist */}
     <AddToWishButton
     id={_id}
        imgUrl={img}
        name={name}
        final_price={final_price}
        original_price={original_price}


     />

      {/* Product Image */}
      <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center">
        <img
          src={img}
          alt={name}
          className="h-36 object-contain"
        />
      </div>

      {/* Product Info */}
      <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
        {name}
      </h3>

      {/* Pricing */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-teal-600">
          ${final_price}
        </span>
        {original_price > final_price && (
          <span className="text-sm text-slate-400 line-through">
            ${original_price}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <p
        className={`text-xs font-medium ${
          stock ? "text-green-600" : "text-red-600"
        }`}
      >
        {stock ? "In Stock" : "Out of Stock"}
      </p>

      {/* Add To Cart */}
      <AddToCartButton
        id={_id}
        imgUrl={img}
        name={name}
        original_price={original_price}
        final_price={final_price}
        disabled={!stock}
      />
    </article>
  );
}

export default ProductCardStore;
