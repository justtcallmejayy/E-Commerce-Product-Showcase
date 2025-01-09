// Fetch products and display them
fetch("products.json")
  .then((response) => response.json())
  .then((products) => {
    const productList = document.getElementById("product-list");

    // Render all products
    function renderProducts(filteredProducts) {
      productList.innerHTML = "";
      filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>$${product.price.toFixed(2)}</p>
          <button data-id="${
            product.id
          }" class="add-to-cart">Add to Cart</button>
        `;
        productList.appendChild(productCard);
      });
    }

    // Initial rendering
    renderProducts(products);

    // Search functionality
    document.getElementById("search").addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      renderProducts(filteredProducts);
    });

    // Filter by category
    document
      .getElementById("categoryFilter")
      .addEventListener("change", (e) => {
        const category = e.target.value;
        const filteredProducts =
          category === "all"
            ? products
            : products.filter((product) => product.category === category);
        renderProducts(filteredProducts);
      });
  })
  .catch((error) => console.error("Error fetching products:", error));

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to local storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  alert(`${product.name} added to cart!`);
}

// Render cart
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <p>${item.name} (x${item.quantity}) - $${(
        item.price * item.quantity
      ).toFixed(2)}</p>
      <button class="remove-item" data-id="${item.id}">Remove</button>
    </div>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Show cart
document.getElementById("view-cart").addEventListener("click", () => {
  renderCart();
  document.getElementById("cart-modal").classList.add("visible");
});

// Close cart
document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-modal").classList.remove("visible");
});

// Clear cart
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

// Remove item from cart
document.getElementById("cart-items").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    renderCart();
  }
});

// Add event listeners to "Add to Cart" buttons
document.getElementById("product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = parseInt(e.target.dataset.id);
    addToCart(productId);
  }
});
