const express = require("express");
const router = express.Router();
const { readFile, writeFile } = require("../utils/fileHelper");

// GET all products
router.get("/", (req, res) => {
  const products = readFile("products.json");
  res.json(products);
});

// DELETE product
router.delete("/:id", (req, res) => {
  let products = readFile("products.json");

  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);

  writeFile("products.json", products);

  res.json({ message: "Product removed successfully" });
});

module.exports = router;