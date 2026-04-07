const express = require("express");
const router = express.Router();
const { readFile, writeFile } = require("../utils/fileHelper");

// ================= TEST =================
router.get("/", (req, res) => {
  res.json({ message: "Seller route working" });
});


// ================= GET SELLER PRODUCTS =================
router.get("/products/:sellerId", (req, res) => {
  const products = readFile("products.json");

  const sellerProducts = products.filter(
    p => String(p.sellerId) === String(req.params.sellerId)
  );

  res.json(sellerProducts);
});


// ================= ADD PRODUCT =================
router.post("/products", (req, res) => {
  const products = readFile("products.json");

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category,
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    price: Number(req.body.price),
    discount: Number(req.body.discount),
    stock: Number(req.body.stock),
    description: req.body.description,
    rating: 0,
    reviews: [],
    image: req.body.image || "",
    sellerId: req.body.sellerId
  };

  products.push(newProduct);
  writeFile("products.json", products);

  res.json(newProduct);
});


// ================= UPDATE PRODUCT =================
router.put("/products/:id", (req, res) => {
  let products = readFile("products.json");
  const id = Number(req.params.id);

  products = products.map(p => {
    if (p.id === id) {
      return {
        ...p,
        name: req.body.name ?? p.name,
        price: req.body.price ?? p.price,
        stock: req.body.stock ?? p.stock,
        discount: req.body.discount ?? p.discount,
        description: req.body.description ?? p.description,
        category: req.body.category ?? p.category,
        subCategory: req.body.subCategory ?? p.subCategory,
        brand: req.body.brand ?? p.brand
      };
    }
    return p;
  });

  writeFile("products.json", products);
  res.json({ message: "Updated successfully" });
});


// ================= DELETE PRODUCT =================
router.delete("/products/:id", (req, res) => {
  let products = readFile("products.json");

  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);

  writeFile("products.json", products);

  res.json({ message: "Deleted successfully" });
});

module.exports = router;