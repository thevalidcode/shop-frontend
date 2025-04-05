import { Currency } from "@/lib/Currency";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [filteredProduct, setFilteredProduct] = useState([]);
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("addToCart")) || [];
    axios.get("http://localhost:2000/products").then((res) => {
      const filtered = cart.filter((eachItem) =>
        res.data.filter((product) => eachItem.id === product.productId),
      );
      setFilteredProduct(filtered);
      // console.log(filtered);
      console.log(cart);
    });
  }, []);
  return (
    <>
      <div className="cs-container">
        {!filteredProduct || filteredProduct.length === 0 ? (
          <p> No product in cart</p>
        ) : (
          <div>
            {filteredProduct.map((product) => (
              <div className="grid grid-cols-2">
                <div className="my-2 flex items-center gap-5">
                  <div className="flex">
                    <img
                      src={product.image}
                      className="h-20 w-20 rounded object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-800"> {product.name} </p>
                    <p className="text-gray-500">
                      {Currency + product.price}
                      <span className="text-black"> X {product.quantity} </span>
                    </p>
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => e.target.value}
                    name=""
                    id=""
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
