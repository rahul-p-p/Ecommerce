function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// function checkAuth() {
//   const user = localStorage.getItem("user");
//   if (!user) {
//     window.location.href = "/login.html";
//   }
// }

// checkAuth();