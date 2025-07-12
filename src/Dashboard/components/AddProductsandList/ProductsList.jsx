import { Plus } from "lucide-react";
import React from "react";

const ProductsList = () => {
  return (
    <>
      <div className="flex justify-between px-5">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
        </div>

        <div>
          <button
            className={`bg-validGreen flex items-center gap-1 rounded px-4 py-2 text-white`}
          >
            <Plus />
            Add Product
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductsList;
