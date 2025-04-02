import React from "react";
import { StarRating } from "../StarRating";
import { NavLink } from "react-router-dom";

export const RelatedProducts = ({
  sameCategoryProducts,
  allProducts,
  product,
  Currency,
}) => {
  return (
    <>
      <div className="mt-10">
        <p className="mb-3 text-xl font-medium">You may also like...</p>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {(() => {
            const relatedProducts = sameCategoryProducts
              .filter(
                (sameCategoryProduct) =>
                  sameCategoryProduct.category === product.category &&
                  sameCategoryProduct.productId !== product.productId,
              )
              .slice(0, 4);
            if (relatedProducts.length === 0) {
              return allProducts.slice(0, 4).map((eachProduct) => (
                <div key={eachProduct.productId}>
                  <NavLink
                    to={`/product/${eachProduct.slug}/${eachProduct.productId}`}
                  >
                    <div>
                      <img
                        src={eachProduct.image}
                        className="mb-2 h-48 w-full rounded-md object-cover"
                        alt={eachProduct.name}
                      />
                      <div className="flex justify-between">
                        <div className="flex gap-2 text-gray-600">
                          <p className="font-light line-through">
                            {Currency + eachProduct.beforePrice}
                          </p>
                          <p className="font-light">
                            {Currency + eachProduct.price}
                          </p>
                        </div>
                        <StarRating rating={eachProduct.reviews.rating} />
                      </div>
                      <p className="text-lg font-medium">{eachProduct.name}</p>
                    </div>
                  </NavLink>
                </div>
              ));
            }
            return relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.productId}>
                <NavLink
                  to={`/product/${relatedProduct.slug}/${relatedProduct.productId}`}
                >
                  <div>
                    <img
                      src={relatedProduct.image}
                      className="mb-2 h-48 w-full rounded-md object-cover"
                      alt={relatedProduct.name}
                    />
                    <div className="flex justify-between">
                      <div className="flex gap-2 text-gray-600">
                        <p className="font-light line-through">
                          {Currency + relatedProduct.beforePrice}
                        </p>
                        <p className="font-light">
                          {Currency + relatedProduct.price}
                        </p>
                      </div>
                      <StarRating rating={relatedProduct.reviews.rating} />
                    </div>
                    <p className="text-lg font-medium">{relatedProduct.name}</p>
                  </div>
                </NavLink>
              </div>
            ));
          })()}
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
