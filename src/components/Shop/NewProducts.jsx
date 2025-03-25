import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const NewProducts = () => {
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
          <div className="grid grid-cols-4 gap-2">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="">
                  <img
                    className="h-100 w-100 rounded-md object-cover"
                    src={product.image}
                    alt=""
                  />
                  <p className="text-xl font-bold">{product.name}</p>
                  <NavLink to={`/product/${product.name}/${product.productId}`}>
                    Go to product
                  </NavLink>
                </div>
              ))
            ) : (
              <p>Loading products...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProducts;
