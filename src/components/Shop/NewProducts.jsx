import React from "react";
import { productsData } from "../../Products/ProductsData";

const NewProducts = () => {
  return (
    <>
      <div className="mx-5 mt-5">
        <h1 className="font-orbitron mb-2 text-3xl font-bold">New Products</h1>
        <div className="scrollbar-hide flex w-full gap-5 overflow-x-auto">
          {productsData.map((productData) => (
            <div key={productData.id} className="relative shrink-0">
              <img
                className="h-100 w-100 rounded-xl object-cover"
                src={productData.img}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewProducts;
