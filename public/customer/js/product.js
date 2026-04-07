const container = document.getElementById("productDetails");

// ================= GET PRODUCT ID FROM URL =================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Product ID:", productId); // 🔍 DEBUG

if (!productId) {
  container.innerHTML = "<p>Invalid product ID</p>";
  throw new Error("Product ID missing in URL");
}

// ================= FETCH PRODUCT FROM BACKEND =================
fetch(`http://localhost:3000/api/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    if (!product || product.message) {
      container.innerHTML = "<p>Product not found</p>";
      return;
    }

    displayProduct(product);
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Failed to load product</p>";
  });


// ================= DISPLAY PRODUCT =================
function displayProduct(product) {
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

        <p class="rating">
          ${generateStars(product.rating)} (${product.rating || 0})
        </p>

        <p class="stock ${product.stock > 0 ? "in" : "out"}">
          ${product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <p class="description">
          ${product.description || "No description available."}
        </p>

        <button onclick="addToCart()" ${product.stock === 0 ? "disabled" : ""}>
          Add to Cart
        </button>

        <button class="buy-now" onclick="buyNow()" ${product.stock === 0 ? "disabled" : ""}>
          Buy Now
        </button>
      </div>
    </div>

    <!-- REVIEWS -->
    <div class="reviews-section">
      <h3>Customer Reviews</h3>

      <div id="reviewsList">
        ${
          product.reviews && product.reviews.length > 0
            ? product.reviews.map(r => `
              <div class="review">
                <p><b>${r.user}</b> - ${generateStars(r.rating)}</p>
                <p>${r.comment}</p>
              </div>
            `).join("")
            : "<p>No reviews yet</p>"
        }
      </div>

      <!-- ADD REVIEW -->
      <div class="add-review">
        <h4>Add Review</h4>
        <input type="text" id="reviewUser" placeholder="Your name">
        <select id="reviewRating">
          <option value="5">5 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="1">1 ⭐</option>
        </select>
        <textarea id="reviewComment" placeholder="Write review..."></textarea>
        <button onclick="submitReview()">Submit</button>
      </div>
    </div>
  `;

  // store product globally for reuse
  window.currentProduct = product;
}


// ================= ADD TO CART =================
function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = window.currentProduct;
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

    fetch("http://localhost:3000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  })
  .then(res => res.json())
  .then(() => {
    showToast("Added to cart ✅");
  });

  showToast("Added to cart ✅");
}


// ================= BUY NOW =================
function buyNow() {
  const product = window.currentProduct;
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


// ================= SUBMIT REVIEW =================
function submitReview() {
  const user = document.getElementById("reviewUser").value.trim();
  const rating = parseInt(document.getElementById("reviewRating").value);
  const comment = document.getElementById("reviewComment").value.trim();

  if (!user || !comment) {
    alert("Please fill all fields");
    return;
  }

  fetch(`http://localhost:3000/api/products/${productId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user, rating, comment })
  })
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(() => {
      showToast("Review added ✅");

      // reload product
      return fetch(`http://localhost:3000/api/products/${productId}`);
    })
    .then(res => res.json())
    .then(updatedProduct => {
      displayProduct(updatedProduct);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to add review");
    });
}

// ================= STAR GENERATOR =================
function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}


// ================= TOAST =================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}