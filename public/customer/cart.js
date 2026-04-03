

const cartContainer = document.getElementById("cartContainer");
const cartTotal = document.getElementById("cartTotal");
const totalItems = document.getElementById("totalItems");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

renderCart();

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

window.changeQty = function(id, change) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

window.removeFromCart = function(id) {
  cart = cart.filter(p => p.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

document.getElementById("checkoutBtn").addEventListener("click", () => {
  alert("Checkout system coming soon 🚀");
});