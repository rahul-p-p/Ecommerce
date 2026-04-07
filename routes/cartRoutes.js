const express = require("express");
const router = express.Router();
const { readFile, writeFile } = require("../utils/fileHelper");

// GET CART
router.get("/", (req, res) => {
  const cart = readFile("cart.json");
  res.json(cart || []);
});

// ADD TO CART
router.post("/", (req, res) => {
  try {
    let cart = readFile("cart.json") || [];

    const product = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    const existing = cart.find(p => p.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    writeFile("cart.json", cart);

    res.json(cart);
  } catch (err) {
    console.error("Cart POST Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE QUANTITY
router.put("/:id", (req, res) => {
  let cart = readFile("cart.json") || [];
  const id = parseInt(req.params.id);
  const { change } = req.body;

  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter(p => p.id !== id);
    }
  }

  writeFile("cart.json", cart);
  res.json(cart);
});

// DELETE ITEM
router.delete("/:id", (req, res) => {
  let cart = readFile("cart.json") || [];
  const id = parseInt(req.params.id);

  cart = cart.filter(p => p.id !== id);

  writeFile("cart.json", cart);
  res.json(cart);
});
router.delete("/", (req, res) => {
  writeFile("cart.json", []);
  res.json({ message: "Cart cleared" });
});

module.exports = router;