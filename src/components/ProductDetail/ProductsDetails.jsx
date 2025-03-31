import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lens } from "../magicui/lens";
import { addViewedProduct } from "@/lib/viewedProducts";
import { Currency } from "@/lib/Currency";
import { StarRating } from "../StarRating";
import { addToCart } from "@/lib/addCart";

const ProductsDetails = () => {
  const { slug, productId } = useParams();
  const [productQuantity, setProductQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:2000/products/")
      .then((response) => {
        const foundProduct = response.data.find(
          (item) =>
            item.productId === parseInt(productId) &&
            item.slug.toLowerCase() === slug.toLowerCase()
        );
        if (!foundProduct) {
          navigate("/404", { replace: true });
        } else {
          setProduct(foundProduct);
          addViewedProduct(foundProduct);
        }
      })
      .catch((error) => console.error("No product found:", error));
  }, [productId, slug, navigate]);

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div>
        <div className="mx-5 mt-5 grid gap-5 md:grid-cols-2 h-screen">
          <div className="">
            <Lens
              zoomFactor={3}
              lensSize={350}
              isStatic={false}
              ariaLabel="Zoom Area"
            >
              <img
                className=" h-100 md:h-150 w-500 rounded-md object-cover object-right"
                src={product.image}
                loading="lazy"
                alt=""
              />
            </Lens>
          </div>
          <div className="">
            <div className="flex items-center gap-5">
              <p
                className={` text-sm  w-fit rounded-md px-2 py-1 ${
                  product.availabilityStatus === "Out of Stock"
                    ? "text-red-500 bg-red-100"
                    : product.availabilityStatus === "In Stock"
                    ? "text-validGreen bg-validGreen/10"
                    : ""
                }`}
              >
                {product.availabilityStatus}
              </p>
              <p className="text-gray-600"> {product.category} </p>
            </div>
            <p className=" text-3xl font-bold"> {product.name} </p>
            <div className="flex items-center gap-2 mt-2">
              <p>
                <span className="text-gray-400">Brand:</span>
                <span className="font-medium"> {product.brand} </span>
              </p>
              <p>
                <span className="text-gray-400">SKU:</span>
                <span className="font-medium"> {product.sku} </span>
              </p>
            </div>

            <div className="flex gap-1 items-center">
              <p className=" text-validGreen mt-2 text-2xl font-semibold">
                {Currency + product.price}
              </p>
              <p className=" text-gray-500 line-through mt-2 text-sm font-semibold">
                {Currency + product.beforePrice}
              </p>
            </div>

            {product.reviews && (
              <div className="flex items-center gap-2">
                <StarRating
                  rating={product.reviews.rating}
                  count={product.reviews.count}
                />
              </div>
            )}

            <p className="text-gray-600 mt-2 leading-7">
              {product.description}
            </p>
            <div>
              {product.stockQuantity === 0 ? (
                <div className="bg-red-100 text-red-500  py-3 px-5 md:text-center rounded-md">
                  <p>
                    This Product cannot be added to cart as it is currently out
                    of stock
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="bg-gray-200 p-1 rounded-full"
                      onClick={() => setProductQuantity((prev) => prev + 1)}
                    >
                      <i className="bx bx-plus" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      className="outline-none appearance-none bg-gray-300 rounded-md px-2 text-center w-20"
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
                      className="bg-gray-200 p-1 rounded-full"
                      onClick={() =>
                        setProductQuantity((prev) =>
                          productQuantity === 0 ? prev : prev - 1
                        )
                      }
                    >
                      <i className="bx bx-minus" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="bg-gray-800 px-10 py-1 text-white flex items-center rounded-md cursor-pointer"
                      onClick={() => addToCart({ product, productQuantity })}
                    >
                      <i className="bx bx-cart" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p>Seller:</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsDetails;
