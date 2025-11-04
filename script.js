const productList = document.getElementById("productList");
const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const searchInput = document.getElementById("searchInput");

let filteredProducts = [...products];

// Render products
function displayProducts(productsToShow = filteredProducts) {
  productList.innerHTML = "";

  if (productsToShow.length === 0) {
    productList.innerHTML = '<p class="no-results">No products found</p>';
    return;
  }

  productsToShow.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <p class="price">£${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})" aria-label="Add ${p.name} to cart">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

// Search and filter
function filterProducts(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(term)
  );
  displayProducts(filteredProducts);
}

// Render cart modal with quantity controls
function updateCartUI() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("cart-item");
      li.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <div class="cart-item-controls">
          <button onclick="updateQuantity(${item.id}, -1)" class="qty-btn" aria-label="Decrease quantity">−</button>
          <span class="quantity">${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)" class="qty-btn" aria-label="Increase quantity">+</button>
          <button onclick="removeFromCart(${item.id})" class="remove-btn" aria-label="Remove ${item.name} from cart">🗑️</button>
        </div>
      `;
      cartItems.appendChild(li);
    });
  }
  totalPrice.textContent = getTotalPrice();
}

// Event listeners
cartIcon.addEventListener("click", () => {
  cartModal.style.display = "block";
  updateCartUI();
});

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Close modal on outside click
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cartModal.style.display === "block") {
    cartModal.style.display = "none";
  }
});

// Search functionality
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    filterProducts(e.target.value);
  });
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showNotification("Your cart is empty!");
    return;
  }

  const total = getTotalPrice();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (confirm(`Checkout ${itemCount} item(s) for £${total}?`)) {
    showNotification("✅ Order placed successfully!");
    clearCart();
    cartModal.style.display = "none";
  }
});

// Initialize
displayProducts();
updateCartCount();
