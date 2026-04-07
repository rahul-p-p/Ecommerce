const order = JSON.parse(localStorage.getItem("pendingOrder"));

if (!order) {
  alert("No order found");
  window.location.href = "index.html";
}

// ================= DYNAMIC PAYMENT UI =================
document.getElementById("paymentMethod").addEventListener("change", renderFields);

function renderFields() {
  const method = document.getElementById("paymentMethod").value;
  const container = document.getElementById("paymentDetails");

  if (method === "card") {
    container.innerHTML = `
      <input placeholder="Card Number">
      <input placeholder="Expiry">
      <input placeholder="CVV">
    `;
  } 
  else if (method === "upi") {
    container.innerHTML = `
      <input placeholder="Enter UPI ID">
    `;
  } 
  else {
    container.innerHTML = `<p>Pay cash on delivery</p>`;
  }
}

renderFields();

// ================= PROCESS PAYMENT =================
function processPayment() {
  // fake delay simulation
  document.querySelector("button").textContent = "Processing...";
  
  setTimeout(() => {
    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    })
      .then(res => res.json())
      .then(() => {
        localStorage.removeItem("pendingOrder");
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutItem");

        window.location.href = "success.html";
      })
      .catch(err => {
        console.error(err);
        alert("Payment failed");
      });
  }, 2000); // ⏳ simulate delay
}