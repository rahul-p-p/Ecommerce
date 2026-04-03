const BASE_URL = "http://localhost:3000/api/admin";
const table = document.getElementById("productTable");

async function fetchProducts() {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const products = await res.json();

    table.innerHTML = "";

    products.forEach(product => {
      table.innerHTML += `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>₹${product.price}</td>
          <td>
            <button onclick="deleteProduct(${product.id})">Remove</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

async function deleteProduct(id) {
  if (!confirm("Remove this product?")) return;

  await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE"
  });

  fetchProducts(); // refresh
}

fetchProducts();