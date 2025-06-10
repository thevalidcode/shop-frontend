import React from "react";

const ProductsList = () => {
  return (
    <>
      <div>
        <a
          href="/dashboard/add-product"
          className="bg-validGreen flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-inner shadow-blue-400/50 transition-all duration-300 hover:shadow-inner hover:shadow-blue-500/70"
        >
          <i className="bx bx-plus text-lg"></i>
          <span className="font-semibold">Add Products</span>
        </a>
      </div>
    </>
  );
};

export default ProductsList;
