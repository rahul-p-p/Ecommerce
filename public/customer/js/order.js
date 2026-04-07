// ================= LOAD NAVBAR =================
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

const container = document.getElementById("ordersContainer");

// ✅ GET CURRENT USER
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  container.innerHTML = "<p>Please login to view orders</p>";
  throw new Error("User not logged in");
}

// ================= FETCH USER ORDERS =================
function loadOrders() {
  fetch(`http://localhost:3000/api/orders/${user.id}`)
    .then(res => res.json())
    .then(orders => {
      renderOrders(orders);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Failed to load orders</p>";
    });
}

loadOrders();


// ================= RENDER =================
function renderOrders(orders) {
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p class='empty'>No orders yet 😢</p>";
    return;
  }

  orders.reverse().forEach(order => {
    let itemsHTML = "";

    if (order.items) {
      order.items.forEach(item => {
        itemsHTML += `
          <div class="order-item">
            <span>${item.name}</span>
            <span>Qty: ${item.quantity}</span>
          </div>
        `;
      });
    }

    container.innerHTML += `
      <div class="order-card" onclick="openOrder(${order.id})">
        <div class="order-header">
          <h4>Order #${order.id}</h4>
          <span class="status ${order.status.toLowerCase()}">${order.status}</span>
        </div>

        <p class="total">Total: ₹${order.total}</p>

        <div class="items">
          ${itemsHTML}
        </div>

        ${
          order.status !== "Cancelled"
            ? `<button onclick="cancelOrder(${order.id})" class="cancel-btn">Cancel Order</button>`
            : ""
        }
      </div>
    `;
  });
}


// ================= CANCEL ORDER =================
window.cancelOrder = function(id) {
  const confirmCancel = confirm("Cancel this order?");
  if (!confirmCancel) return;

  fetch(`http://localhost:3000/api/orders/${id}/cancel`, {
    method: "PUT"
  })
    .then(res => res.json())
    .then(() => {
      loadOrders(); // reload UI
    })
    .catch(err => {
      console.error(err);
      alert("Failed to cancel order");
    });
};

function openOrder(orderId) {
  localStorage.setItem("selectedOrderId", orderId);
  window.location.href = "order-details.html";
}