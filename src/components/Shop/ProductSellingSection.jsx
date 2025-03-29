import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Currency from "../Currency";

const ProductSellingSection = () => {
  const [products, setProducts] = useState("");
  const [randomProducts, setRandomProducts] = useState("");
  const [trendingProducts, setTrendingProducts] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:2000/products")
      .then((response) => {
        setProducts(response.data);
        setRandomProducts(
          response.data.length > 0
            ? [...response.data].sort(() => Math.random() - 0.5).slice(0, 4)
            : [],
        );

        setTrendingProducts(
          response.data
            .filter((trendingProduct) => trendingProduct.stat > 3000)
            .slice(0, 4),
        );
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <>
      <div className="mx-5 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* New Products */}
        <div className="m-2 rounded-md bg-white p-3 shadow">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-600">New Products</p>
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
            <p className="text-lg font-semibold text-gray-600">You Viewed</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            <p>No viewed product</p>
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
              trendingProducts.map((trendingProduct) =>
                trendingProduct.stat > 3000 ? (
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
                ) : (
                  ""
                ),
              )
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
            <p className="text-lg font-semibold text-gray-600">You Viewed</p>
            <NavLink className="flex items-center text-sm font-semibold text-gray-600">
              View All <i className="bx bx-chevron-right"></i>
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-md">
            <p>No viewed product</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSellingSection;
