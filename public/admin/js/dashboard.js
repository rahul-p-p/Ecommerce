const BASE_URL = "http://localhost:3000/api/admin";

async function loadDashboard() {
  try {
    const [usersRes, productsRes, ordersRes] = await Promise.all([
      fetch(`${BASE_URL}/users`),
      fetch(`${BASE_URL}/products`),
      fetch(`${BASE_URL}/orders`)
    ]);

    const users = await usersRes.json();
    const products = await productsRes.json();
    const orders = await ordersRes.json();

    document.getElementById("userCount").innerText = users.length;
    document.getElementById("productCount").innerText = products.length;
    document.getElementById("orderCount").innerText = orders.length;

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

loadDashboard();