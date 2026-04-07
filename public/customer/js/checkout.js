// ================= LOAD DATA =================
let items = [];
let total = 0;

// 🔥 Load cart from backend
function loadCheckout() {
  const buyNowItem = JSON.parse(localStorage.getItem("checkoutItem"));

  if (buyNowItem) {
    // BUY NOW FLOW
    items = [buyNowItem];
    total = buyNowItem.finalPrice * buyNowItem.quantity;
    renderCheckout();
  } else {
    // CART FLOW (FROM BACKEND)
    fetch("http://localhost:3000/api/cart")
      .then(res => res.json())
      .then(cart => {
        items = cart;

        total = 0;
        items.forEach(item => {
          const price = item.discount
            ? item.price - (item.price * item.discount) / 100
            : item.price;

          total += price * item.quantity;
        });

        renderCheckout();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load checkout");
      });
  }
}




// ================= RENDER =================
function renderCheckout() {
  document.getElementById("total").textContent = total;

  const container = document.getElementById("checkoutItems");
  container.innerHTML = "";

  items.forEach(item => {
    const price = item.finalPrice || item.price;

    container.innerHTML += `
      <div class="checkout-item">
        <p><b>${item.name}</b></p>
        <p>Qty: ${item.quantity}</p>
        <p>₹${price}</p>
      </div>
    `;
  });
}


// ================= PLACE ORDER =================
function placeOrder() {
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    alert("Please login first");
    return;
  }

  if (!address || !phone) {
    alert("Please fill all details");
    return;
  }

  fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.id,
      items,
      total,
      address,
      phone
    })
  })
    .then(res => res.json())
    .then(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutItem");

      localStorage.setItem("pendingOrder", JSON.stringify({
        userId: user.id,
        items,
        total,
        address,
        phone
      }));

      window.location.href = "payment.html";
    })
    .catch(err => {
      console.error(err);
      alert("Order failed");
    });
}


// ================= CANCEL =================
function cancelCheckout() {
  const confirmCancel = confirm("Are you sure you want to cancel checkout?");
  if (!confirmCancel) return;

  localStorage.removeItem("checkoutItem");
  window.location.href = "index.html";
}

// ================= LOAD USER DETAILS =================
function loadUserDetails() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) return;

  fetch(`http://localhost:3000/api/auth/user/${user.id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("address").value = data.address || "";
      document.getElementById("phone").value = data.phone || "";
    })
    .catch(err => {
      console.error("User fetch error:", err);
    });
}


loadCheckout();
loadUserDetails(); // ✅ ADD THIS