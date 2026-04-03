const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");

// helper
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
// ================= SIGNUP =================
router.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  let users = getUsers();

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  // 🔥 AUTO ID GENERATION
  const id = Date.now().toString(); // unique timestamp ID

  const newUser = {
    id,
    username,
    email,
    password,
    role
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ success: true, message: "Signup successful", userId: id });
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ADMIN
  if (email === "admin@shop.com" && password === "admin123") {
    return res.json({ success: true, role: "admin" });
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ success: false, message: "Wrong password" });
  }

  res.json({ success: true, role: user.role });
});

module.exports = router;