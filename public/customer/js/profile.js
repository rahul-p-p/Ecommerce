// ================= LOAD NAVBAR =================
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

// ================= GET USER =================
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  alert("Please login first");
  window.location.href = "/login.html";
}

// ================= LOAD USER DATA =================
fetch(`http://localhost:3000/api/auth/user/${user.id}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("username").value = data.username || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("address").value = data.address || "";
  });

// ================= UPDATE PROFILE =================
function updateProfile() {
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  fetch(`http://localhost:3000/api/auth/profile/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, phone, address })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Update failed");
        return;
      }

      // 🔥 update localStorage also
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      alert("Profile updated ✅");
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart"); // optional
  localStorage.removeItem("checkoutItem"); // optional

  alert("Logged out successfully");

  window.location.href = "/login.html";
}