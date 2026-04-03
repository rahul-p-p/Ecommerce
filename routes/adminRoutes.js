const express = require("express");
const router = express.Router();
const { readFile, writeFile } = require("../utils/fileHelper");


// ================= USERS =================

// GET all users
router.get("/users", (req, res) => {
  const users = readFile("users.json");
  res.json(users);
});

// DELETE user
router.delete("/users/:id", (req, res) => {
  let users = readFile("users.json");

  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);

  writeFile("users.json", users);

  res.json({ message: "User deleted successfully" });
});


// ================= PRODUCTS =================

// GET all products
router.get("/products", (req, res) => {
  const products = readFile("products.json");
  res.json(products);
});

// DELETE product
router.delete("/products/:id", (req, res) => {
  let products = readFile("products.json");

  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);

  writeFile("products.json", products);

  res.json({ message: "Product removed successfully" });
});


// ================= ORDERS =================

// GET all orders
router.get("/orders", (req, res) => {
  const orders = readFile("orders.json");
  res.json(orders);
});


// ================= DASHBOARD =================

// GET dashboard stats
router.get("/dashboard", (req, res) => {
  const users = readFile("users.json");
  const products = readFile("products.json");
  const orders = readFile("orders.json");

  res.json({
    totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: orders.length
  });
});

module.exports = router;

// PRODUCTS
router.get("/products", (req, res) => {
  const products = readFile("products.json");
  res.json(products);
});

router.delete("/products/:id", (req, res) => {
  let products = readFile("products.json");
  const id = parseInt(req.params.id);

  products = products.filter(p => p.id !== id);
  writeFile("products.json", products);

  res.json({ message: "Product removed successfully" });
});


// ORDERS
router.get("/orders", (req, res) => {
  const orders = readFile("orders.json");
  res.json(orders);
});