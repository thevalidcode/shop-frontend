import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductsDetails = () => {
  const { name, productId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:2000/products/")
      .then((response) => {
        const foundProduct = response.data.find(
          (item) =>
            item.productId === parseInt(productId) &&
            item.name.toLowerCase() === name.toLocaleLowerCase(),
        );
        if (!foundProduct) {
          navigate("/404", { replace: true });
        } else {
          setProduct(foundProduct);
        }
      })
      .catch((error) => console.error("No product found:", error));
  }, [productId, name, navigate]);
  if (!product) return <p>Loading...</p>;
  return (
    <>
      <div>
        <p> {product.name} </p>
      </div>
    </>
  );
};

export default ProductsDetails;
