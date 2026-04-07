const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");

// ================= HELPERS =================
function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ================= SIGNUP =================
router.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  let users = getUsers();

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  const id = Date.now(); // number ID (important)

  const newUser = {
    id,
    username,
    email,
    password,
    role,
    address: "",
    phone: ""
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ success: true, message: "Signup successful", user: newUser });
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ADMIN
  if (email === "admin@shop.com" && password === "admin123") {
    return res.json({
      success: true,
      role: "admin",
      user: { id: 0, email }
    });
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ success: false, message: "Wrong password" });
  }

  // ✅ RETURN USER (IMPORTANT)
  res.json({
    success: true,
    role: user.role,
    user: user
  });
});



// ================= UPDATE PROFILE =================
router.put("/profile/:id", (req, res) => {
  let users = getUsers();

  const id = req.params.id; // ✅ KEEP AS STRING

  const { username, address, phone } = req.body;

  const userIndex = users.findIndex(
    u => String(u.id) === String(id) // ✅ FIXED
  );

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    username: username || users[userIndex].username,
    address: address || users[userIndex].address,
    phone: phone || users[userIndex].phone
  };

  saveUsers(users);

  res.json({
    success: true,
    user: users[userIndex]
  });
});
// GET USER BY ID
router.get("/user/:id", (req, res) => {
  const users = getUsers();


  const user = users.find(u => String(u.id) === String(req.params.id));


  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = router;