export const addToCart = ({ product, productQuantity }) => {
  const cart = JSON.parse(localStorage.getItem("addToCart")) || [];
  const existingProduct = cart.find((item) => item.id === product.productId);
  if (existingProduct) {
    existingProduct.quantity += Number(productQuantity);
  } else {
    cart.push({
      id: product.productId,
      quantity: Number(productQuantity),
    });
  }
  localStorage.setItem("addToCart", JSON.stringify(cart));
  console.table(cart);
  return cart;
};
