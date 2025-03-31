import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getViewedProducts } from "@/lib/viewedProducts";
import { Currency } from "@/lib/Currency";

const ProductSellingSection = () => {
  const [products, setProducts] = useState("");
  const [randomProducts, setRandomProducts] = useState("");
  const [trendingProducts, setTrendingProducts] = useState("");
  const [viewedProducts, setViewedProducts] = useState([]);

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    axios
      .get("http://localhost:2000/products")
      .then((response) => {
        setProducts(response.data);
        setRandomProducts(
          response.data.length > 0
            ? shuffleArray(response.data).slice(0, 4)
            : []
        );

        setTrendingProducts(
          response.data
            .filter((trendingProduct) => trendingProduct.stat > 6000)
            .slice(0, 4)
        );

        setViewedProducts(getViewedProducts());
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <>
      <div className="mx-5 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* New Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">New Arrivals</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {products.length > 0 ? (
              products.slice(0, 4).map((product) => (
                <div key={product.productId} className="">
                  <NavLink to={`/product/${product.slug}/${product.productId}`}>
                    <img
                      className="h-30 w-50 rounded-md object-cover"
                      src={product.image}
                      alt=""
                    />
                    <p className="truncate font-medium text-gray-600">
                      {product.name}
                    </p>
                    <p className="truncate font-bold">
                      {Currency + product.price}
                    </p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading Products...</p>
            )}
          </div>
        </div>
        {/* Random Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">You may like</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {randomProducts.length > 0 ? (
              randomProducts.map((randomProduct) => (
                <div key={randomProduct.productId} className="">
                  <NavLink
                    to={`/product/${randomProduct.slug}/${randomProduct.productId}`}
                  >
                    <img
                      className="h-30 w-50 rounded-md object-cover"
                      src={randomProduct.image}
                      alt=""
                    />
                    <p className="truncate font-medium text-gray-600">
                      {randomProduct.name}
                    </p>
                    <p className="truncate font-bold">
                      {Currency + randomProduct.price}
                    </p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading Products...</p>
            )}
          </div>
        </div>
        {/* Random Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">You may like</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {randomProducts.length > 0 ? (
              randomProducts.map((randomProduct) => (
                <div key={randomProduct.productId} className="">
                  <NavLink
                    to={`/product/${randomProduct.slug}/${randomProduct.productId}`}
                  >
                    <img
                      className="h-30 w-50 rounded-md object-cover"
                      src={randomProduct.image}
                      alt=""
                    />
                    <p className="truncate font-medium text-gray-600">
                      {randomProduct.name}
                    </p>
                    <p className="truncate font-bold">
                      {Currency + randomProduct.price}
                    </p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading Products...</p>
            )}
          </div>
        </div>
        {/* Products that customers have viewed */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">
              Do you like these?
            </p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {viewedProducts.length > 0 ? (
              viewedProducts.map((viewedProduct) => (
                <div key={viewedProduct.productId} className="">
                  <NavLink
                    to={`/product/${viewedProduct.slug}/${viewedProduct.productId}`}
                  >
                    <div>
                      <img
                        className="h-30 w-50 rounded-md object-cover"
                        src={viewedProduct.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="truncate font-medium text-gray-600">
                        {viewedProduct.name}
                      </p>
                      <p className="truncate font-bold">
                        {Currency + viewedProduct.price}
                      </p>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>No viewed product</p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-5 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Trending Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">Trending</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((trendingProduct) => (
                <div key={trendingProduct.productId} className="">
                  <NavLink
                    to={`/product/${trendingProduct.slug}/${trendingProduct.productId}`}
                  >
                    <img
                      className="h-30 w-50 rounded-md object-cover"
                      src={trendingProduct.image}
                      alt=""
                    />
                    <p className="truncate font-medium text-gray-600">
                      {trendingProduct.name}{" "}
                    </p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading Products...</p>
            )}
          </div>
        </div>
        {/* Random Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">You may like</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {randomProducts.length > 0 ? (
              randomProducts.map((randomProduct) => (
                <div key={randomProduct.productId} className="">
                  <NavLink
                    to={`/product/${randomProduct.slug}/${randomProduct.productId}`}
                  >
                    <img
                      className="h-30 w-50 rounded-md object-cover"
                      src={randomProduct.image}
                      alt=""
                    />
                    <p className="truncate font-medium text-gray-600">
                      {randomProduct.name}
                    </p>
                    <p className="truncate font-bold">
                      {Currency + randomProduct.price}
                    </p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading Products...</p>
            )}
          </div>
        </div>
        {/* Random Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">You may like</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {randomProducts.length > 0 ? (
              randomProducts.map((randomProduct) => (
                <div key={randomProduct.productId} className="">
                  <NavLink
                    to={`/product/${randomProduct.slug}/${randomProduct.productId}`}
                  >
                    <img
                      className="h-30 w-50 rounded-md object-cover"
                      src={randomProduct.image}
                      alt=""
                    />
                    <p className="truncate font-medium text-gray-600">
                      {randomProduct.name}
                    </p>
                    <p className="truncate font-bold">
                      {Currency + randomProduct.price}
                    </p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading Products...</p>
            )}
          </div>
        </div>
        {/* Products that customers have viewed */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">
              Do you like these?
            </p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            {viewedProducts.length > 0 ? (
              viewedProducts.map((viewedProduct) => (
                <div key={viewedProduct.productId} className="">
                  <NavLink
                    to={`/product/${viewedProduct.slug}/${viewedProduct.productId}`}
                  >
                    <div>
                      <img
                        className="h-30 w-50 rounded-md object-cover"
                        src={viewedProduct.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="truncate font-medium text-gray-600">
                        {viewedProduct.name}
                      </p>
                      <p className="truncate font-bold">
                        {Currency + viewedProduct.price}
                      </p>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>No viewed product</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSellingSection;
