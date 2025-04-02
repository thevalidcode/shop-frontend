import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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
  const cartSectionRef = useRef(null);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sameCategoryProducts, setSameCategoryProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:2000/products/")
      .then((response) => {
        setSameCategoryProducts(response.data);
        const foundProduct = response.data.find(
          (item) =>
            item.productId === parseInt(productId) &&
            item.slug.toLowerCase() === slug.toLowerCase(),
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsAnimating(true);
          setShowStickyCart(true);
        } else {
          setIsAnimating(false);
          setTimeout(() => setShowStickyCart(false), 300); // Match animation duration
        }
      },
      { threshold: 0 },
    );

    if (cartSectionRef.current) {
      observer.observe(cartSectionRef.current);
    }
  });

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div className="selection:bg-validGreen/70 mx-5 selection:text-white">
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="">
            <Lens
              zoomFactor={3}
              lensSize={350}
              isStatic={false}
              ariaLabel="Zoom Area"
            >
              <img
                className="h-100 w-500 rounded-md object-cover object-right md:h-150"
                src={product.image}
                loading="lazy"
                alt=""
              />
            </Lens>
          </div>
          <div className="">
            <div className="flex items-center gap-5">
              <p
                className={`w-fit rounded-md px-2 py-1 text-sm ${
                  product.stockQuantity === 0
                    ? "bg-red-100 text-red-500"
                    : "text-validGreen bg-validGreen/10"
                }`}
              >
                {product.stockQuantity === 0 ? "Out of Stock" : "In Stock"}
              </p>

              <p className="text-gray-600"> {product.category} </p>
            </div>
            <p className="text-3xl font-bold"> {product.name} </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p>
                <span className="text-gray-400">Brand:</span>
                <span className="font-medium"> {product.brand} </span>
              </p>
              <p>
                <span className="text-gray-400">SKU:</span>
                <span className="font-medium"> {product.sku} </span>
              </p>
              {product.reviews && (
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={product.reviews.rating}
                    count={product.reviews.count}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <p className="text-validGreen mt-5 text-2xl font-semibold">
                {Currency + product.price}
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-500 line-through">
                {Currency + product.beforePrice}
              </p>
            </div>

            <p className="mt-5 leading-7 text-gray-600">
              {product.description}
            </p>
            <div className="mt-5 border-b border-gray-200 py-5">
              {product.stockQuantity === 0 ? (
                <div className="rounded-md bg-red-100 px-5 py-3 text-red-500 md:text-center">
                  <p>
                    This Product cannot be added to cart as it is currently out
                    of stock
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <div
                    ref={cartSectionRef}
                    className="mt-2 flex items-center gap-2"
                  >
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

            <div className="border-b border-gray-200 py-5">
              <p className="mb-2 font-semibold text-gray-700">
                Seller Information
              </p>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-200 p-3 px-4">
                    <i class="bx bx-store-alt text-xl"></i>
                  </div>
                  <div>
                    <p className="font-medium"> {product.seller.name} </p>
                    <p className="text-sm text-gray-500"> Official Store </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-200 p-3 px-4">
                    <i class="bx bxs-location-plus text-xl"></i>
                  </div>
                  <div>
                    <p className="font-medium"> {product.seller.location} </p>
                    <p className="text-sm text-gray-500"> Location </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showStickyCart && (
          <div
            className={`animate__animated ${isAnimating ? "animate__fadeInUp" : "animate__fadeOutDown"} fixed right-0 bottom-0 left-0 z-30 mb-15 border-t bg-white/10 p-4 shadow-lg backdrop-blur-lg md:mb-0`}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              {/* Left side: Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div>
                  <h3 className="max-w-xs truncate font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-validGreen font-semibold">
                      {Currency + product.price}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {Currency + product.beforePrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side: Controls */}
              <div className="flex items-center gap-4">
                {/* Stock Status */}
                <p
                  className={`hidden rounded-md px-2 py-1 text-sm md:flex ${
                    product.stockQuantity === 0
                      ? "bg-red-100 text-red-500"
                      : "text-validGreen bg-validGreen/10"
                  }`}
                >
                  {product.stockQuantity === 0 ? "Out of Stock" : "In Stock"}
                </p>

                {/* Quantity Controls */}
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    className="rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300"
                    onClick={() =>
                      setProductQuantity((prev) =>
                        Math.min(prev + 1, product.stockQuantity),
                      )
                    }
                  >
                    <i className="bx bx-plus" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    className="w-16 appearance-none rounded-md bg-gray-300 px-2 text-center outline-none"
                    value={productQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setProductQuantity(value);
                        return;
                      }
                      const numericValue = parseInt(value, 10);
                      if (
                        !isNaN(numericValue) &&
                        numericValue >= 1 &&
                        numericValue <= product.stockQuantity
                      ) {
                        setProductQuantity(numericValue);
                      }
                    }}
                    onBlur={() => {
                      if (productQuantity === "" || productQuantity < 1) {
                        setProductQuantity(1);
                      } else if (productQuantity > product.stockQuantity) {
                        setProductQuantity(product.stockQuantity);
                      }
                    }}
                  />
                  <button
                    className="rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300"
                    onClick={() =>
                      setProductQuantity((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    <i className="bx bx-minus" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 transition-colors ${
                    product.stockQuantity === 0
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    product.stockQuantity > 0 &&
                    addToCart({ product, productQuantity })
                  }
                  disabled={product.stockQuantity === 0}
                >
                  <i className="bx bx-cart" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <p className="mb-3 text-xl font-medium">You may also like...</p>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {sameCategoryProducts
              .filter(
                (sameCategoryProduct) =>
                  sameCategoryProduct.category === product.category &&
                  sameCategoryProduct.productId !== product.productId,
              )
              .slice(0, 4)
              .map((sameCategoryProduct) =>
                sameCategoryProduct ? (
                  <div key={sameCategoryProduct.productId}>
                    <NavLink
                      to={`/product/${sameCategoryProduct.slug}/${sameCategoryProduct.productId}`}
                    >
                      <div>
                        <img
                          src={sameCategoryProduct.image}
                          className="mb-2 h-48 w-full rounded-md object-cover"
                          alt={sameCategoryProduct.name}
                        />
                        <div className="flex justify-between">
                          <div className="flex gap-2 text-gray-600">
                            <p className="font-light line-through">
                              {Currency + sameCategoryProduct.beforePrice}
                            </p>
                            <p className="font-light">
                              {Currency + sameCategoryProduct.price}
                            </p>
                          </div>

                          <StarRating
                            rating={sameCategoryProduct.reviews.rating}
                          />
                        </div>
                        <p className="text-lg font-medium">
                          {sameCategoryProduct.name}
                        </p>
                      </div>
                    </NavLink>
                  </div>
                ) : (
                  <div>
                    <p>No related products</p>
                  </div>
                ),
              )}
          </div>
        </div>

        <NavLink
          to={`https://api.whatsapp.com/send?text=http://localhost:5173/product/${product.slug}/${product.productId}`}
          target="_blank"
        >
          Whatsapp
        </NavLink>
      </div>
    </>
  );
};

export default ProductsDetails;
