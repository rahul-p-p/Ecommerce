const BASE_URL = "http://localhost:3000/api/admin";
const table = document.getElementById("orderTable");

async function fetchOrders() {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    const orders = await res.json();

    table.innerHTML = "";

    orders.forEach(order => {
      table.innerHTML += `
        <tr>
          <td>${order.id}</td>
          <td>${order.user}</td>
          <td>₹${order.total}</td>
          <td>
            <span class="status ${order.status.toLowerCase()}">
              ${order.status}
            </span>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}

fetchOrders();