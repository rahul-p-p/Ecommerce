let currentOrder = null;
// LOAD NAVBAR
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

const container = document.getElementById("orderDetailsContainer");

const user = JSON.parse(localStorage.getItem("currentUser"));
const orderId = localStorage.getItem("selectedOrderId");

if (!user || !orderId) {
  container.innerHTML = "<p>Invalid access</p>";
  throw new Error("Missing data");
}

// FETCH ORDERS
fetch(`http://localhost:3000/api/orders/${user.id}`)
  .then(res => res.json())
  .then(orders => {
  const order = orders.find(o => String(o.id) === String(orderId));

  if (!order) {
    container.innerHTML = "<p>Order not found</p>";
    return;
  }

  currentOrder = order; // ✅ SAVE IT GLOBALLY
  renderOrderDetails(order);
});


// RENDER DETAILS
function renderOrderDetails(order) {
  let itemsHTML = "";

  order.items.forEach(item => {
    itemsHTML += `
      <div class="item">
        <img src="${item.image}" />
        <div>
          <h4>${item.name}</h4>
          <p>Price: ₹${item.finalPrice}</p>
          <p>Qty: ${item.quantity}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="details-card">
      <h3>Order #${order.id}</h3>
      <p class="status ${order.status.toLowerCase()}">${order.status}</p>

      <h4>Delivery Info</h4>
      <p>Address: ${order.address}</p>
      <p>Phone: ${order.phone}</p>

      <h4>Items</h4>
      <div class="items">
        ${itemsHTML}
      </div>

      <h3>Total: ₹${order.total}</h3>

      ${
        order.status !== "Cancelled"
          ? `<button onclick="cancelOrder(${order.id})">Cancel Order</button>`
          : ""
      }
      ${renderTimeline(order.timeline)}
    </div>
  `;
}


// CANCEL ORDER
function cancelOrder(id) {
  fetch(`http://localhost:3000/api/orders/${id}/cancel`, {
    method: "PUT"
  })
    .then(res => res.json())
    .then(() => {
      alert("Order cancelled");
      window.location.href = "orders.html";
    });
}

setInterval(() => {
  fetch(`http://localhost:3000/api/orders/${user.id}`)
    .then(res => res.json())
    .then(orders => {
      const order = orders.find(o => String(o.id) === String(orderId));
      renderOrderDetails(order);
    });
}, 5000); // refresh every 5 sec

function renderTimeline(timeline) {
  return `
    <div class="timeline">
      ${timeline.map(step => `
        <div class="step ${step.completed ? "done" : ""}">
          <div class="circle"></div>
          <p>${step.step}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function reorder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  currentOrder.items.forEach(item => {
    const existing = cart.find(p => p.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Items added to cart 🛒");
  window.location.href = "cart.html";
}

setTimeout(() => {
  fetch(`/api/orders/${order.id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Shipped" })
  });
}, 10000);

setTimeout(() => {
  fetch(`/api/orders/${order.id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Delivered" })
  });
}, 20000);