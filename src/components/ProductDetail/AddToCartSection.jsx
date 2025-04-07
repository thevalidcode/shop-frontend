import React from "react";

export const AddToCartSection = ({
  product,
  cartSectionRef,
  setProductQuantity,
  productQuantity,
  addToCart,
}) => {
  return (
    <>
      <div className="mt-5 border-b border-gray-200 py-5">
        {product.stockQuantity === 0 ? (
          <div className="rounded-md bg-red-100 px-5 py-3 text-red-500 md:text-center">
            <p>
              This Product cannot be added to cart as it is currently out of
              stock
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div ref={cartSectionRef} className="mt-2 flex items-center gap-2">
              <button
                className="rounded-full bg-gray-200 p-1"
                onClick={() => setProductQuantity((prev) => prev + 1)}
              >
                <i className="bx bx-plus" />
              </button>
              <input
                type="number"
                min="1"
                className="w-20 appearance-none rounded-md bg-gray-300 px-2 text-center outline-none"
                value={productQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setProductQuantity(value);
                    return;
                  }
                  const numericValue = parseInt(value, 10);
                  if (!isNaN(numericValue) && numericValue >= 1) {
                    setProductQuantity(numericValue);
                  }
                }}
                onBlur={() => {
                  if (productQuantity === "" || productQuantity < 1) {
                    setProductQuantity(1);
                  }
                }}
              />
              <button
                className="rounded-full bg-gray-200 p-1"
                onClick={() =>
                  setProductQuantity((prev) =>
                    productQuantity === 0 ? prev : prev - 1,
                  )
                }
              >
                <i className="bx bx-minus" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                className="flex cursor-pointer items-center rounded bg-gray-800 px-10 py-2 text-white"
                onClick={() => addToCart({ product, productQuantity })}
              >
                <i className="bx bx-cart" />
                Add to Cart
              </button>
            </div>
            <div>
              <i class="bx bx-heart text-3xl"></i>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddToCartSection;
