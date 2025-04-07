export const addToCart = ({ product, productQuantity }) => {
  // Ensure we always get an array
  const cart = JSON.parse(localStorage.getItem("addToCart")) || [];

  // If cart is not an array (somehow got corrupted), reset it
  if (!Array.isArray(cart)) {
    console.warn("Cart was corrupted, resetting to empty array");
    localStorage.setItem("addToCart", JSON.stringify([]));
    return addToCart({ product, productQuantity }); // Retry with fresh array
  }

  const existingProduct = cart.find((item) => item.id === product.productId);
  if (existingProduct) {
    existingProduct.quantity += Number(productQuantity);
  } else {
    cart.push({
      id: product.productId,
      quantity: Number(productQuantity),
      name: product.name,
      image: product.image,
      price: product.price,
    });
  }
  localStorage.setItem("addToCart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  return cart;
};
