import { Currency } from "@/lib/Currency";
import { addQuantity } from "@/lib/ManupulateCartQuantity";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [filteredProduct, setFilteredProduct] = useState([]);
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("addToCart")) || [];
    axios.get("http://localhost:2000/products").then((res) => {
      const filtered = res.data
        .filter((product) => cart.some((item) => item.id === product.productId))
        .map((product) => {
          const cartItem = cart.find((item) => item.id === product.productId);
          return {
            ...product,
            quantity: cartItem.quantity,
          };
        });
      setFilteredProduct(filtered);
      // console.log(filtered);
      console.log(cart);
    });
  }, []);

  const handleQuantityChange = (product, change) => {
    if (change === "increase" && product.quantity < product.stockQuantity) {
      addQuantity(product);
    } else if (change === "decrease" && product.quantity > 1) {
      addQuantity(product, -1);
    }
    console.log(product.stockQuantity);
    window.addEventListener(new Event("cartUpdated"));
  };
  return (
    <>
      <div className="cs-container">
        {!filteredProduct || filteredProduct.length === 0 ? (
          <p> No product in cart</p>
        ) : (
          <div>
            {filteredProduct.map((product) => (
              <div className="flex items-center gap-10" key={product.name}>
                <div className="flex">
                  <img
                    src={product.image}
                    className="h-20 w-20 rounded object-cover"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <p className="w-50 truncate text-lg font-semibold text-gray-800">
                    {product.name}
                  </p>
                </div>
                <div className="rounded-md border border-gray-300 px-2 py-1">
                  <button
                    onClick={() => handleQuantityChange(product, "increase")}
                  >
                    <i className="bx bx-plus"></i>
                  </button>
                  <input
                    type="number"
                    className="w-10 text-center outline-none"
                    value={
                      product.quantity > product.stockQuantity
                        ? product.stockQuantity
                        : product.quantity
                    }
                    onChange={(e) => e.target.value}
                    name=""
                    id=""
                  />
                  <button
                    onClick={() => handleQuantityChange(product, "decrease")}
                  >
                    <i className="bx bx-minus"></i>
                  </button>
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
