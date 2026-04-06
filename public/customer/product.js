const container = document.getElementById("productDetails");
const product = JSON.parse(localStorage.getItem("selectedProduct"));

// ================= DISPLAY PRODUCT =================
if (!product) {
  container.innerHTML = "<p>Product not found</p>";
} else {
  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  container.innerHTML = `
    <div class="product-view">
      <img src="${product.image}" alt="${product.name}">

      <div class="product-info">
        <h2>${product.name}</h2>

        <p class="brand">Brand: <b>${product.brand}</b></p>
        <p class="category">${product.category} → ${product.subCategory}</p>

        <p class="price">
          ₹${discountedPrice}
          ${product.discount ? `<span class="old-price">₹${product.price}</span>` : ""}
          ${product.discount ? `<span class="discount">(${product.discount}% OFF)</span>` : ""}
        </p>

        <p class="rating">⭐ ${product.rating} / 5</p>

        <p class="stock ${product.stock > 0 ? "in" : "out"}">
          ${product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <button onclick="addToCart(${product.id})" ${product.stock === 0 ? "disabled" : ""}>
          Add to Cart
        </button>

        <button class="buy-now" onclick="buyNow(${product.id})" ${product.stock === 0 ? "disabled" : ""}>
          Buy Now
        </button>
      </div>
    </div>
  `;
}

// ================= ADD TO CART =================
function addToCart(productId) {
   localStorage.setItem("cart", JSON.stringify(cart));

  showToast("Added to cart ✅");
  function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount(); // 🔥 update instantly
}
}

// ================= BUY NOW =================
function buyNow(productId) {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const checkoutItem = {
    ...product,
    quantity: 1,
    finalPrice: discountedPrice
  };

  localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));

  window.location.href = "checkout.html";
}

// ================= TOAST MESSAGE =================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}