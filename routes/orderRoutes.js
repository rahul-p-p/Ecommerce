const express = require("express");
const router = express.Router();
const { readFile } = require("../utils/fileHelper");

// GET all orders
router.get("/", (req, res) => {
  const orders = readFile("orders.json");
  res.json(orders);
});

module.exports = router;