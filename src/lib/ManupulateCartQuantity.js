export const addQuantity = (product, change = 1) => {
  const cart = JSON.parse(localStorage.getItem("addToCart"));
  if (!Array.isArray(cart)) {
    const cart = localStorage.setItem("addToCart", JSON.stringify(cart)) || [];
    console.warn("Error in cart Logic. Cart has been reset");
  }

  const existingProduct = cart.find((item) => item.id === product.productId);

  if (existingProduct) {
    existingProduct.quantity += change;
  }

  if (existingProduct.quantity < 1) {
    existingProduct.quantity = 1;
  }

  localStorage.setItem("addToCart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};
