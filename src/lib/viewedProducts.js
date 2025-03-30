const MAX_VIEWED_PRODUCTS = 4;

export const getViewedProducts = () => {
  const viewedProducts =
    JSON.parse(localStorage.getItem("viewedProducts")) || [];
  return viewedProducts;
};

export const addViewedProduct = (product) => {
  let viewedProducts = getViewedProducts();
  viewedProducts = viewedProducts.filter(
    (p) => p.productId !== product.productId
  );
  viewedProducts.unshift(product);
  viewedProducts = viewedProducts.slice(0, MAX_VIEWED_PRODUCTS);
  localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
};
