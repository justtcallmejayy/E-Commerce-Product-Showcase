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
