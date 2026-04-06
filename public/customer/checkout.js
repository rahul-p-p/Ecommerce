// GET DATA FROM BOTH SOURCES
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let buyNowItem = JSON.parse(localStorage.getItem("checkoutItem"));

let items = [];
let total = 0;

// If Buy Now exists → use it
if (buyNowItem) {
  items = [buyNowItem];

  total = buyNowItem.finalPrice * buyNowItem.quantity;
} else {
  items = cart;

  items.forEach(item => {
    const price = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;

    total += price * item.quantity;
  });
}

// SHOW TOTAL
document.getElementById("total").textContent = total;

const container = document.getElementById("checkoutItems");

items.forEach(item => {
  container.innerHTML += `
    <div class="checkout-item">
      <p><b>${item.name}</b></p>
      <p>Qty: ${item.quantity}</p>
      <p>₹${item.finalPrice || item.price}</p>
    </div>
  `;
});

// PLACE ORDER
function placeOrder() {
  const address = document.querySelector("input[placeholder='Enter Address']").value;
  const phone = document.querySelector("input[placeholder='Phone Number']").value;

  if (!address || !phone) {
    alert("Please fill all details");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    id: Date.now(),
    items: items,
    total: total,
    address,
    phone,
    status: "Placed"
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutItem");

  window.location.href = "success.html";
}
function cancelCheckout() {
  const confirmCancel = confirm("Are you sure you want to cancel checkout?");

  if (confirmCancel) {
    localStorage.removeItem("checkoutItem");
    window.location.href = "index.html";
  }
}