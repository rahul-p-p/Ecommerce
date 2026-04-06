
document.addEventListener("DOMContentLoaded", () => {

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryChecks = document.querySelectorAll(".categoryCheck");
const subCategoryFilter = document.getElementById("subCategoryFilter");
const brandFilter = document.getElementById("brandFilter");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const ratingFilter = document.getElementById("ratingFilter");
const inStockFilter = document.getElementById("inStockFilter");
const discountFilter = document.getElementById("discountFilter");
const sortFilter = document.getElementById("sortFilter");
const clearBtn = document.getElementById("clearFilters");
const loader = document.getElementById("loader");
const pagination = document.getElementById("pagination");
const suggestionsBox = document.getElementById("suggestions");
const cartCount = document.getElementById("cartCount");

let products = [
  { "id": 1, "name": "Dell Inspiron 15", "category": "Electronics", "subCategory": "Laptop", "brand": "Dell", "price": 55000, "discount": 10, "stock": 12, "rating": 4, "image": "asset/img1.png" },
  { "id": 2, "name": "HP Pavilion", "category": "Electronics", "subCategory": "Laptop", "brand": "HP", "price": 60000, "discount": 15, "stock": 8, "rating": 5, "image": "asset/img1.png" },
  { "id": 3, "name": "Lenovo IdeaPad", "category": "Electronics", "subCategory": "Laptop", "brand": "Lenovo", "price": 48000, "discount": 8, "stock": 10, "rating": 4, "image": "asset/img1.png" },
  { "id": 4, "name": "Asus VivoBook", "category": "Electronics", "subCategory": "Laptop", "brand": "Asus", "price": 52000, "discount": 12, "stock": 5, "rating": 4, "image":  "asset/img1.png" },
  { "id": 5, "name": "Acer Nitro 5", "category": "Electronics", "subCategory": "Laptop", "brand": "Acer", "price": 75000, "discount": 18, "stock": 6, "rating": 5, "image": "asset/Acer Nitro 5.jpg" },

  { "id": 6, "name": "iPhone 14", "category": "Electronics", "subCategory": "Mobile", "brand": "Apple", "price": 70000, "discount": 5, "stock": 15, "rating": 5, "image": "asset/iphone.jpg" },
  { "id": 7, "name": "Samsung Galaxy S23", "category": "Electronics", "subCategory": "Mobile", "brand": "Samsung", "price": 45000, "discount": 10, "stock": 20, "rating": 4, "image": "asset/s23.jpg" },
  { "id": 8, "name": "OnePlus 11R", "category": "Electronics", "subCategory": "Mobile", "brand": "OnePlus", "price": 35000, "discount": 12, "stock": 18, "rating": 4, "image": "asset/OnePlus 11R.jpg" },
  { "id": 9, "name": "Realme Narzo", "category": "Electronics", "subCategory": "Mobile", "brand": "Realme", "price": 18000, "discount": 20, "stock": 25, "rating": 3, "image": "asset/Realme Narzo.jpg" },
  { "id": 10, "name": "Vivo V27", "category": "Electronics", "subCategory": "Mobile", "brand": "Vivo", "price": 22000, "discount": 10, "stock": 17, "rating": 4, "image": "asset/Vivo V27.jpg" },

  { "id": 11, "name": "Sony WH-1000XM4", "category": "Electronics", "subCategory": "Headphones", "brand": "Sony", "price": 3000, "discount": 15, "stock": 30, "rating": 4, "image": "asset/Sony.jpg" },
  { "id": 12, "name": "Boat Rockerz", "category": "Electronics", "subCategory": "Headphones", "brand": "Boat", "price": 1200, "discount": 25, "stock": 40, "rating": 4, "image": "asset/Boat.jpg" },
  { "id": 13, "name": "JBL Flip 5", "category": "Electronics", "subCategory": "Speaker", "brand": "JBL", "price": 4000, "discount": 10, "stock": 22, "rating": 5, "image": "asset/jbl.jpg" },
  { "id": 14, "name": "Noise Smart Watch", "category": "Electronics", "subCategory": "Smartwatch", "brand": "Noise", "price": 2500, "discount": 30, "stock": 35, "rating": 4, "image": "asset/Noise.jpg" },
  { "id": 15, "name": "Logitech Mouse", "category": "Electronics", "subCategory": "Accessories", "brand": "Logitech", "price": 800, "discount": 5, "stock": 50, "rating": 3, "image": "asset/Mouse.jpg" },

  { "id": 16, "name": "Nike Sports Shoes", "category": "Fashion", "subCategory": "Footwear", "brand": "Nike", "price": 2200, "discount": 20, "stock": 25, "rating": 5, "image": "asset/Nike.jpg" },
  { "id": 17, "name": "Adidas Running Shoes", "category": "Fashion", "subCategory": "Footwear", "brand": "Adidas", "price": 2500, "discount": 15, "stock": 20, "rating": 4, "image": "asset/Adidas.jpg" },
  { "id": 18, "name": "Puma Sandals", "category": "Fashion", "subCategory": "Footwear", "brand": "Puma", "price": 900, "discount": 10, "stock": 30, "rating": 3, "image": "asset/Puma.jpg" },
  { "id": 19, "name": "Woodland Boots", "category": "Fashion", "subCategory": "Footwear", "brand": "Woodland", "price": 3000, "discount": 12, "stock": 12, "rating": 4, "image": "asset/Woodland.jpg" },
  { "id": 20, "name": "Bata Slippers", "category": "Fashion", "subCategory": "Footwear", "brand": "Bata", "price": 500, "discount": 5, "stock": 40, "rating": 3, "image": "asset/Bata.jpg" },

  { "id": 21, "name": "Levis Jeans", "category": "Fashion", "subCategory": "Clothing", "brand": "Levis", "price": 1500, "discount": 18, "stock": 20, "rating": 4, "image": "asset/Levis Jeans.jpg" },
  { "id": 22, "name": "Zara Jacket", "category": "Fashion", "subCategory": "Clothing", "brand": "Zara", "price": 2500, "discount": 20, "stock": 10, "rating": 5, "image": "asset/Zara Jacket.jpg" },
  { "id": 23, "name": "H&M T-Shirt", "category": "Fashion", "subCategory": "Clothing", "brand": "H&M", "price": 800, "discount": 25, "stock": 35, "rating": 4, "image": "asset/H&M.jpg" },
  { "id": 24, "name": "Allen Solly Shirt", "category": "Fashion", "subCategory": "Clothing", "brand": "Allen Solly", "price": 1100, "discount": 10, "stock": 18, "rating": 4, "image": "asset/Allen.jpg" },
  { "id": 25, "name": "Biba Kurti", "category": "Fashion", "subCategory": "Clothing", "brand": "Biba", "price": 1200, "discount": 15, "stock": 22, "rating": 4, "image": "asset/Kurti.jpg" },

  { "id": 26, "name": "Samsung LED TV", "category": "Electronics", "subCategory": "TV", "brand": "Samsung", "price": 30000, "discount": 12, "stock": 8, "rating": 5, "image": "asset/samsung.jpg" },
  { "id": 27, "name": "LG Refrigerator", "category": "Electronics", "subCategory": "Appliances", "brand": "LG", "price": 25000, "discount": 10, "stock": 6, "rating": 5, "image": "asset/lg.jpg" },
  { "id": 28, "name": "IFB Washing Machine", "category": "Electronics", "subCategory": "Appliances", "brand": "IFB", "price": 20000, "discount": 15, "stock": 7, "rating": 4, "image": "asset/Washing.jpg" },
  { "id": 29, "name": "Voltas AC", "category": "Electronics", "subCategory": "Appliances", "brand": "Voltas", "price": 35000, "discount": 18, "stock": 5, "rating": 4, "image": "asset/Voltas.jpg" },
  { "id": 30, "name": "Panasonic Microwave", "category": "Electronics", "subCategory": "Appliances", "brand": "Panasonic", "price": 8000, "discount": 20, "stock": 10, "rating": 4, "image": "asset/Microwave.jpg" },

  { "id": 31, "name": "Mi Power Bank", "category": "Electronics", "subCategory": "Accessories", "brand": "Mi", "price": 1500, "discount": 10, "stock": 30, "rating": 4, "image": "asset/Mi Power Bank.jpg" },
  { "id": 32, "name": "TP-Link Router", "category": "Electronics", "subCategory": "Accessories", "brand": "TP-Link", "price": 2500, "discount": 8, "stock": 15, "rating": 4, "image": "asset/TP-Link Router.jpg" },
  { "id": 33, "name": "HP Printer", "category": "Electronics", "subCategory": "Printer", "brand": "HP", "price": 9000, "discount": 12, "stock": 9, "rating": 4, "image": "asset/HP Printer.jpg" },
  { "id": 34, "name": "Dell Monitor", "category": "Electronics", "subCategory": "Monitor", "brand": "Dell", "price": 12000, "discount": 10, "stock": 11, "rating": 4, "image": "asset/Dell Monitor.jpg" },
  { "id": 35, "name": "Apple iPad", "category": "Electronics", "subCategory": "Tablet", "brand": "Apple", "price": 28000, "discount": 5, "stock": 14, "rating": 5, "image": "asset/Apple iPad.jpg" },

  { "id": 36, "name": "Fastrack Watch", "category": "Fashion", "subCategory": "Accessories", "brand": "Fastrack", "price": 3500, "discount": 15, "stock": 16, "rating": 4, "image": "asset/Fastrack Watch.jpg" },
  { "id": 37, "name": "Skybags Backpack", "category": "Fashion", "subCategory": "Bags", "brand": "Skybags", "price": 1500, "discount": 10, "stock": 20, "rating": 4, "image": "asset/Skybags Backpack.jpg" },
  { "id": 38, "name": "Wildcraft Laptop Bag", "category": "Fashion", "subCategory": "Bags", "brand": "Wildcraft", "price": 1200, "discount": 12, "stock": 18, "rating": 4, "image": "asset/Wildcraft Laptop Bag.jpg" },
  { "id": 39, "name": "RayBan Sunglasses", "category": "Fashion", "subCategory": "Accessories", "brand": "RayBan", "price": 2000, "discount": 20, "stock": 10, "rating": 5, "image": "asset/RayBan Sunglasses.jpg" },
  { "id": 40, "name": "Tommy Hilfiger Wallet", "category": "Fashion", "subCategory": "Accessories", "brand": "Tommy Hilfiger", "price": 900, "discount": 8, "stock": 25, "rating": 4, "image": "asset/Tommy Hilfiger Wallet.jpg" },

  { "id": 41, "name": "Canon Printer", "category": "Electronics", "subCategory": "Printer", "brand": "Canon", "price": 10000, "discount": 15, "stock": 7, "rating": 4, "image": "asset/Canon Printer.jpg" },
  { "id": 42, "name": "LG Monitor", "category": "Electronics", "subCategory": "Monitor", "brand": "LG", "price": 13000, "discount": 10, "stock": 9, "rating": 4, "image": "asset/LG Monitor.jpg" },
  { "id": 43, "name": "Samsung Tablet", "category": "Electronics", "subCategory": "Tablet", "brand": "Samsung", "price": 26000, "discount": 12, "stock": 13, "rating": 4, "image": "asset/Samsung Tablet.jpg" },
  { "id": 44, "name": "Nike Track Pants", "category": "Fashion", "subCategory": "Clothing", "brand": "Nike", "price": 1400, "discount": 18, "stock": 21, "rating": 4, "image": "asset/Nike Track Pants.jpg" },
  { "id": 45, "name": "Adidas Hoodie", "category": "Fashion", "subCategory": "Clothing", "brand": "Adidas", "price": 1800, "discount": 20, "stock": 19, "rating": 5, "image": "asset/Adidas Hoodie.jpg" },

  { "id": 46, "name": "Puma Cap", "category": "Fashion", "subCategory": "Accessories", "brand": "Puma", "price": 400, "discount": 10, "stock": 30, "rating": 3, "image": "asset/Puma Cap.jpg" },
  { "id": 47, "name": "Boat Bluetooth Speaker", "category": "Electronics", "subCategory": "Speaker", "brand": "Boat", "price": 3500, "discount": 22, "stock": 18, "rating": 4, "image": "asset/Voltas.jpg" },
  { "id": 48, "name": "Sony Home Theatre", "category": "Electronics", "subCategory": "Speaker", "brand": "Sony", "price": 15000, "discount": 15, "stock": 6, "rating": 5, "image": "asset/Sony Home Theatre.jpg" },
  { "id": 49, "name": "Havells Induction", "category": "Electronics", "subCategory": "Appliances", "brand": "Havells", "price": 3000, "discount": 12, "stock": 14, "rating": 4, "image": "asset/Havells Induction.jpg" },
  { "id": 50, "name": "Bajaj Mixer Grinder", "category": "Electronics", "subCategory": "Appliances", "brand": "Bajaj", "price": 4500, "discount": 18, "stock": 12, "rating": 4, "image": "asset/Bajaj Mixer Grinder.jpg" }
];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentPage = 1;
const productsPerPage = 10;

updateCartCount();


// ================= FETCH PRODUCTS =================

filteredProducts = [...products];
    render();
    updateSubCategoryFilter(); // initialize subcategory dropdown
    updateBrandFilter(); 
// ================= RENDER =================
function render() {
  displayProducts();
  setupPagination();
}


// ================= DISPLAY PRODUCTS =================
function displayProducts() {
  productContainer.innerHTML = "";

  const start = (currentPage - 1) * productsPerPage;
  const items = filteredProducts.slice(start, start + productsPerPage);

  if (items.length === 0) {
    productContainer.innerHTML = "<p>No products found</p>";
    return;
  }

  items.forEach(product => {

    const discountPercent = product.discount || 0;
    const discountedPrice = discountPercent
      ? Math.round(product.price - (product.price * discountPercent / 100))
      : product.price;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      ${discountPercent ? `<span class="discount-badge">${discountPercent}% OFF</span>` : ""}
      <img src="${product.image}" class="product-img">
      <h4>${product.name}</h4>
      <p>${product.brand || ""}</p>
      <p class="price">₹${discountedPrice}</p>
      ${discountPercent ? `<small><del>₹${product.price}</del></small>` : ""}
      <p>${product.rating} ★</p>
      <p class="${product.stock > 0 ? 'in-stock' : 'out-stock'}">
        ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
      </p>
      <button ${product.stock === 0 ? "disabled" : ""}>
        ${product.stock === 0 ? "Out of Stock" : "Add to Basket"}
      </button>
    `;
    div.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "product.html";
    });

    div.querySelector("button")?.addEventListener("click", () => {
      if (product.stock > 0) addToCart(product.id);
    });

    productContainer.appendChild(div);
  });
}


// ================= PAGINATION =================
function setupPagination() {
  pagination.innerHTML = "";
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pagination.appendChild(btn);
  }
}

function filterProducts() {

  const search = searchInput.value.trim().toLowerCase();
  const selectedCategories = Array.from(categoryChecks)
    .filter(c => c.checked)
    .map(c => c.value);

  filteredProducts = products.filter(p => {

    const discountedPrice = p.discount
      ? p.price - (p.price * p.discount / 100)
      : p.price;

    // ✅ Match product name OR subcategory
    const matchesSearch = p.name.toLowerCase().includes(search) || 
                          (p.subCategory && p.subCategory.toLowerCase().includes(search));

    return (
      matchesSearch &&
      (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
      (!subCategoryFilter.value || p.subCategory === subCategoryFilter.value) &&
      (!brandFilter.value || p.brand === brandFilter.value) &&
      discountedPrice <= priceRange.value &&
      (!ratingFilter.value || p.rating >= Number(ratingFilter.value)) &&
      (!inStockFilter.checked || p.stock > 0) &&
      (!discountFilter.value || p.discount >= Number(discountFilter.value))
    );
  });

  // ✅ Sorting (keep your existing sort code here if needed)
  if (sortFilter.value === "lowHigh")
    filteredProducts.sort((a,b) => {
      const priceA = a.discount ? a.price - a.price*a.discount/100 : a.price;
      const priceB = b.discount ? b.price - b.price*b.discount/100 : b.price;
      return priceA - priceB;
    });

  if (sortFilter.value === "highLow")
    filteredProducts.sort((a,b) => {
      const priceA = a.discount ? a.price - a.price*a.discount/100 : a.price;
      const priceB = b.discount ? b.price - b.price*b.discount/100 : b.price;
      return priceB - priceA;
    });

  if (sortFilter.value === "rating")
    filteredProducts.sort((a,b) => b.rating - a.rating);

  if (sortFilter.value === "discount")
    filteredProducts.sort((a,b) => (b.discount||0) - (a.discount||0));

  currentPage = 1;
  render();
}


// ================= CART =================
function addToCart(id) {
  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({...product, quantity:1});
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => {
    return sum + (Number(i.quantity) || 0);
  }, 0);

  cartCount.textContent = total || 0;
}


// ================= PRICE SLIDER =================
priceRange.addEventListener("input", () => {
  priceValue.textContent = priceRange.value;
  filterProducts();
});


// ================= CLEAR FILTERS =================
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  subCategoryFilter.value = "";
  brandFilter.value = "";
  ratingFilter.value = "";
  discountFilter.value = "";
  sortFilter.value = "";
  inStockFilter.checked = false;
  categoryChecks.forEach(c => c.checked = false);
  priceRange.value = 80000;
  priceValue.textContent = 80000;

  filteredProducts = [...products];
  render();
});

function updateSubCategoryFilter() {
  const selectedCategories = Array.from(categoryChecks)
    .filter(c => c.checked)
    .map(c => c.value);

  let filtered = products;

  if (selectedCategories.length > 0) {
    filtered = products.filter(p =>
      selectedCategories.includes(p.category)
    );
  }

  // Get unique subcategories
  const subCategories = [...new Set(filtered.map(p => p.subCategory).filter(Boolean))];

  // Reset subcategory dropdown
  subCategoryFilter.innerHTML = `<option value="">All</option>`;
  subCategories.forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    subCategoryFilter.appendChild(option);
  });
}

function updateBrandFilter() {
  const selectedSubCategory = subCategoryFilter.value;

  let filtered = products;
    
  if (selectedSubCategory) {
    filtered = products.filter(p => p.subCategory === selectedSubCategory);
  }

  const brands = [...new Set(filtered.map(p => p.brand).filter(Boolean))];

  brandFilter.innerHTML = `<option value="">All Brands</option>`;
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
}
// ================= EVENTS =================
searchInput.addEventListener("input", () => {
  showSuggestions();
  filterProducts();
});

// When category changes → update subcategory + filter products
categoryChecks.forEach(c =>
  c.addEventListener("change", () => {
    updateSubCategoryFilter();
    subCategoryFilter.value = ""; // reset subcategory
    updateBrandFilter();          // reset brand
    filterProducts();
  })
);

// When subcategory changes → update brand + filter products
subCategoryFilter.addEventListener("change", () => {
  updateBrandFilter();
  filterProducts();
});
brandFilter.addEventListener("change",filterProducts);
ratingFilter.addEventListener("change",filterProducts);
inStockFilter.addEventListener("change",filterProducts);
discountFilter.addEventListener("change",filterProducts);
sortFilter.addEventListener("change",filterProducts);


function showSuggestions() {
  const value = searchInput.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";
  if (!value) return;

  // Filter products by name OR subcategory
  const matches = products.filter(p => {
    const matchesName = p.name.toLowerCase().includes(value);
    const matchesSub = p.subCategory && p.subCategory.toLowerCase().includes(value);
    return matchesName || matchesSub;
  }).slice(0, 5);

  matches.forEach(match => {
    const div = document.createElement("div");

    // Show product name + subcategory in suggestion
    div.textContent = `${match.name} (${match.subCategory})`;

    div.onclick = () => {
      searchInput.value = match.name;

      // Auto select category & subcategory
      categoryChecks.forEach(c => c.checked = (c.value === match.category));
      subCategoryFilter.value = match.subCategory || "";
      updateBrandFilter();

      suggestionsBox.innerHTML = "";
      filterProducts();
    };

    suggestionsBox.appendChild(div);
  });

  // Show message if nothing matches
  if (suggestionsBox.innerHTML === "") {
    suggestionsBox.innerHTML = "<div>No match found</div>";
  }
}
document.addEventListener("click", e => {
  if (!e.target.closest("#searchInput"))
    suggestionsBox.innerHTML = "";
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    suggestionsBox.innerHTML = "";

    const value = searchInput.value.trim().toLowerCase();

    // Find first matching product by name OR subcategory
    const match = products.find(p =>
      p.name.toLowerCase().includes(value) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(value))
    );

    if (match) {
      // Auto select category checkboxes
      categoryChecks.forEach(c => {
        c.checked = c.value === match.category;
      });

      // Update subcategory dropdown based on selected category
      updateSubCategoryFilter();
      subCategoryFilter.value = match.subCategory || "";

      // Update brand filter
      updateBrandFilter();
    }

    // Filter products based on current filters
    filterProducts();
  }
});

});


