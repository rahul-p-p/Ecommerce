const user = JSON.parse(localStorage.getItem("currentUser"));

let editProductId = null;
let allProducts = [];

// ================= AUTH =================
if (!user || user.role !== "seller") {
  alert("Seller login required");
  window.location.href = "/login.html";
}

// ================= INIT =================
loadProducts();
loadOrders();


// ================= FETCH HELPER =================
function handleResponse(res) {
  if (!res.ok) throw new Error("Error " + res.status);
  return res.json();
}


// ================= LOAD PRODUCTS =================
function loadProducts() {
  fetch(`/api/seller/products/${user.id}`)
    .then(handleResponse)
    .then(data => {
      allProducts = data;
      renderProducts(data);
    });
}


// ================= LOAD ORDERS =================
function loadOrders() {
  fetch(`/api/orders/seller-orders/${user.id}`)
    .then(handleResponse)
    .then(renderOrders);
}


// ================= ADD PRODUCT =================
function addProduct() {
  fetch("/api/seller/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("pname").value,
      category: document.getElementById("pcategory").value,
      subCategory: document.getElementById("psubCategory").value,
      brand: document.getElementById("pbrand").value,
      price: Number(document.getElementById("pprice").value),
      discount: Number(document.getElementById("pdiscount").value),
      stock: Number(document.getElementById("pstock").value),
      description: document.getElementById("pdesc").value,
      sellerId: user.id
    })
  }).then(() => loadProducts());
}


// ================= DELETE =================
function deleteProduct(id) {
  fetch(`/api/seller/products/${id}`, { method: "DELETE" })
    .then(() => loadProducts());
}


// ================= EDIT OPEN =================
function editProduct(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  editProductId = id;

  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editStock").value = product.stock;
  document.getElementById("editDiscount").value = product.discount;
  document.getElementById("editDesc").value = product.description;

  document.getElementById("editModal").style.display = "block";
}


// ================= SAVE EDIT =================
function saveEdit() {
  fetch(`/api/seller/products/${editProductId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("editName").value,
      price: Number(document.getElementById("editPrice").value),
      stock: Number(document.getElementById("editStock").value),
      discount: Number(document.getElementById("editDiscount").value),
      description: document.getElementById("editDesc").value
    })
  }).then(() => {
    closeModal();
    loadProducts();
  });
}


// ================= CLOSE MODAL =================
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}


// ================= RENDER PRODUCTS =================
function renderProducts(products) {
  document.getElementById("products").innerHTML = products.map(p => `
    <div style="border:1px solid #ccc;padding:10px;margin:10px;">
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <p>Stock: ${p.stock}</p>

      <button onclick="editProduct(${p.id})">Edit</button>
      <button onclick="deleteProduct(${p.id})">Delete</button>
    </div>
  `).join("");
}


// ================= RENDER ORDERS =================
function renderOrders(orders) {
  document.getElementById("orders").innerHTML = orders.map(order => {
    const myItems = order.items.filter(
      i => String(i.sellerId) === String(user.id)
    );

    return `
      <div style="border:1px solid #ccc;padding:10px;margin:10px;">
        <h4>Order #${order.id}</h4>

        ${myItems.map(i => `
          <p>${i.name} - Qty: ${i.quantity}</p>
        `).join("")}

        <p>Status: ${order.status}</p>

        <select onchange="updateStatus(${order.id}, this.value)">
          <option value="Placed" ${order.status === "Placed" ? "selected" : ""}>Placed</option>
          <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
          <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
        </select>
      </div>
    `;
  }).join("");
}


// ================= UPDATE STATUS =================
function updateStatus(orderId, status) {
  fetch(`/api/orders/seller-order-status/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
    .then(res => res.json())
    .then(() => loadOrders())
    .catch(err => console.error(err));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/login.html";
}