import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ProductSellingPage = () => {
  const [products, setProducts] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:2000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <>
      <div className="mx-5">
        <h2 className="font-orbitron mb-2 text-3xl font-bold">New Products</h2>
        <div className="">
          <div className="grid grid-cols-2 gap-2 rounded-md border-[1px] border-gray-200 md:grid-cols-3 lg:grid-cols-4">
            {products.length > 0 ? (
              products.slice(0, 4).map((product) => (
                <div
                  key={product.productId}
                  className="rounded-md bg-white p-5"
                >
                  <p className="text-sm font-light text-gray-500">
                    {product.category}
                  </p>
                  <NavLink
                    to={`/product/${product.name}/${product.productId}`}
                    className="text-lg font-semibold text-gray-800"
                  >
                    {product.name}
                  </NavLink>
                  <NavLink to={`/product/${product.name}/${product.productId}`}>
                    <img
                      className="h-60 w-full gap-x-5 rounded-md object-cover md:h-60 lg:h-90"
                      src={product.image}
                      loading="lazy"
                      alt=""
                    />
                  </NavLink>
                  <div className="flex justify-between">
                    <p className="text-lg">{"₦" + product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading products....</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSellingPage;
