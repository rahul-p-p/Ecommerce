const cartContainer = document.getElementById("cartContainer");
const cartTotal = document.getElementById("cartTotal");
const totalItems = document.getElementById("totalItems");

let cart = [];

// ================= LOAD CART FROM BACKEND =================
function loadCart() {
  fetch("http://localhost:3000/api/cart")
    .then(res => res.json())
    .then(data => {
      cart = data;
      renderCart();
    })
    .catch(err => {
      console.error("Cart load error:", err);
    });
}

loadCart();


// ================= RENDER =================
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your Cart is Empty 😢</p>";
    cartTotal.textContent = 0;
    totalItems.textContent = 0;
    return;
  }

  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {

    const discountedPrice = item.discount
      ? Math.round(item.price - (item.price * item.discount / 100))
      : item.price;

    total += discountedPrice * item.quantity;
    itemCount += item.quantity;

    const div = document.createElement("div");
    div.className = "cart-product";

    div.innerHTML = `
      <div class="cart-image">
        <img src="${item.image}">
      </div>

      <div class="cart-details">
        <h4>${item.name}</h4>
        <p class="stock">In Stock</p>

        <div class="cart-actions">
          <div class="qty-box">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <button class="delete-btn" onclick="removeFromCart(${item.id})">
            Delete
          </button>
        </div>
      </div>

      <div class="cart-price">
        ₹${discountedPrice}
      </div>
    `;

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = total;
  totalItems.textContent = itemCount;
}


// ================= CHANGE QTY =================
window.changeQty = function(id, change) {
  fetch(`http://localhost:3000/api/cart/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ change })
  })
    .then(res => res.json())
    .then(data => {
      cart = data;
      renderCart();
    })
    .catch(err => console.error(err));
};


// ================= REMOVE =================
window.removeFromCart = function(id) {
  fetch(`http://localhost:3000/api/cart/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      cart = data;
      renderCart();
    })
    .catch(err => console.error(err));
};


// ================= CHECKOUT =================
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  window.location.href = "checkout.html";
});