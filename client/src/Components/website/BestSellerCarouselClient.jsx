"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ProductCard from "./ProductCard";

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                 w-10 h-10 rounded-full bg-white shadow
                 flex items-center justify-center text-xl"
    >
      ›
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                 w-10 h-10 rounded-full bg-white shadow
                 flex items-center justify-center text-xl"
    >
      ‹
    </button>
  );
}

export default function BestSellerCarousel({ products }) {
  if (!Array.isArray(products)) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
