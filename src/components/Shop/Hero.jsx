import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import axios from "axios";
import { Currency } from "@/lib/Currency";

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:2000/products").then((response) => {
      setProducts(response.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-[calc(100vh-110px)] w-full overflow-hidden">
        <div className="h-full w-full animate-pulse bg-gray-200"></div>
      </div>
    );
  }

  return (
    <>
      <div className="cs-container relative mt-2 h-[calc(100vh-110px)] w-full overflow-hidden">
        <Splide
          aria-label="Featured Products"
          options={{
            type: "loop",
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            speed: 1000,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {products.slice(0, 4).map((eachSlide) => (
            <SplideSlide key={eachSlide.id} className="relative">
              <div className="relative h-[calc(100vh-110px)] w-full">
                <img
                  src={eachSlide.image}
                  className="h-full w-full object-cover brightness-75"
                  alt={eachSlide.name}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
                  <div className="absolute right-0 bottom-0 left-0 p-10 text-white md:p-20">
                    <h2 className="font-orbitron mb-4 text-4xl font-bold md:text-6xl lg:text-7xl">
                      {eachSlide.name}
                    </h2>
                    <p className="mb-6 line-clamp-5 max-w-2xl text-lg text-gray-200 md:text-xl">
                      {eachSlide.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-bold text-green-400 md:text-3xl">
                        {Currency + eachSlide.price}
                      </p>
                      {eachSlide.beforePrice && (
                        <p className="text-lg text-gray-400 line-through">
                          {Currency + eachSlide.beforePrice}
                        </p>
                      )}
                    </div>
                    <NavLink
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-green-700"
                      to={`/product/${eachSlide.slug}/${eachSlide.productId}`}
                    >
                      Shop Now
                      <i className="bx bx-right-arrow-alt text-xl"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </>
  );
};

export default Hero;
