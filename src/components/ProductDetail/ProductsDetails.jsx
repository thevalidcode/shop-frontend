import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductsDetails = () => {
  const { slug, productId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:2000/products/")
      .then((response) => {
        const foundProduct = response.data.find(
          (item) =>
            item.productId === parseInt(productId) &&
            item.slug.toLowerCase() === slug.toLowerCase(),
        );
        if (!foundProduct) {
          navigate("/404", { replace: true });
        } else {
          setProduct(foundProduct);
        }
        let viewedProducts =
          JSON.parse(localStorage.getItem("viewedProducts")) || [];
        viewedProducts = viewedProducts.filter(
          (p) => p.productId !== foundProduct.productId,
        );
        viewedProducts.unshift(foundProduct);
        if (viewedProducts.length > 4) viewedProducts.pop;
        viewedProducts = localStorage.setItem(
          "viewedProducts",
          JSON.stringify(viewedProducts),
        );
      })
      .catch((error) => console.error("No product found:", error));
  }, [productId, slug, navigate]);
  if (!product) return <p>Loading...</p>;
  return (
    <>
      <div>
        <div className="mx-5 mt-5 grid gap-5 md:grid-cols-2">
          <div className="">
            <img
              className="h-150 w-500 rounded-md object-cover object-right"
              src={product.image}
              alt=""
            />
          </div>
          <div className="">
            <p className="text-gray-600"> {product.category} </p>
            <p className="font-orbitron text-4xl font-bold"> {product.name} </p>
            <p className="font-orbitron mt-10 text-3xl font-bold">
              {"₦" + product.price}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsDetails;
