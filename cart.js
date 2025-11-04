let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  const item = cart.find(item => item.id === id);
  if (item) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    updateCartCount();
    showNotification(`${item.name} removed from cart`);
  }
}

function updateQuantity(id, delta) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateCartUI();
      updateCartCount();
    }
  }
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function getTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}
