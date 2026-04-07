const express = require("express");
const router = express.Router();
const { readFile, writeFile } = require("../utils/fileHelper");

// ================= GET ALL PRODUCTS =================
router.get("/", (req, res) => {
  const products = readFile("products.json");
  res.json(products);
});

// ================= GET SINGLE PRODUCT =================
router.get("/:id", (req, res) => {
  const products = readFile("products.json");
  const id = parseInt(req.params.id);

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// ================= DELETE PRODUCT =================
router.delete("/:id", (req, res) => {
  let products = readFile("products.json");

  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);

  writeFile("products.json", products);

  res.json({ message: "Product removed successfully" });
});

// ================= ADD REVIEW =================
router.post("/:id/review", (req, res) => {
  let products = readFile("products.json");
  const id = parseInt(req.params.id);

  const { user, rating, comment } = req.body;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!product.reviews) product.reviews = [];

  product.reviews.push({ user, rating, comment });

  // ✅ UPDATE AVERAGE RATING
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = Math.round(total / product.reviews.length);

  writeFile("products.json", products);

  res.json({ message: "Review added", product });
});

router.post("/products", (req, res) => {
  const products = readFile("products.json");

  const newProduct = {
    id: Date.now(),
    ...req.body
  };

  products.push(newProduct);
  writeFile("products.json", products);

  res.json(newProduct);
});

router.get("/products/:sellerId", (req, res) => {
  const products = readFile("products.json");

  const result = products.filter(
    p => p.sellerId === req.params.sellerId
  );

  res.json(result);
});

router.delete("/products/:id", (req, res) => {
  let products = readFile("products.json");

  products = products.filter(p => p.id != req.params.id);

  writeFile("products.json", products);

  res.json({ message: "Deleted" });
});

module.exports = router;