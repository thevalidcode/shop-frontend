import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ProductSellingSection = () => {
  const [products, setProducts] = useState("");
  const [randomProducts, setRandomProducts] = useState("");
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
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <>
      <div className="mx-5 mt-5 grid grid-cols-3">
        {/* New Products */}
        <div className="bg-white p-5">
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
                      {product.name}{" "}
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
        <div className="bg-white p-5">
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
        <div className="bg-white p-5">
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
