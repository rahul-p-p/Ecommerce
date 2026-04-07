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
const pagination = document.getElementById("pagination");
const suggestionsBox = document.getElementById("suggestions");
const cartCount = document.getElementById("cartCount");

let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 10;

// ================= LOAD CART =================
function loadCart() {
  fetch("http://localhost:3000/api/cart")
    .then(res => res.json())
    .then(data => {
      cart = data;
      updateCartCount();
    });
}

loadCart();

// ================= FETCH PRODUCTS =================
fetch("http://localhost:3000/api/products")
  .then(res => res.json())
  .then(data => {
    products = data.map(p => ({
      ...p,
      name: (p.name || "").toLowerCase(),
      category: (p.category || "").toLowerCase(),
      subCategory: (p.subCategory || "").toLowerCase(),
      brand: (p.brand || "").toLowerCase()
    }));

    filteredProducts = [...products];

    updateSubCategoryFilter();
    updateBrandFilter();
    render();
  });

// ================= RENDER =================
function render() {
  displayProducts();
  setupPagination();
}

// ================= DISPLAY =================
function displayProducts() {
  productContainer.innerHTML = "";

  const start = (currentPage - 1) * productsPerPage;
  const items = filteredProducts.slice(start, start + productsPerPage);

  if (items.length === 0) {
    productContainer.innerHTML = "<p>No products found</p>";
    return;
  }

  items.forEach(product => {

    const discount = product.discount || 0;
    const finalPrice = discount
      ? Math.round(product.price - (product.price * discount / 100))
      : product.price;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      ${discount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
      <img src="${product.image}" class="product-img">
      <h4>${product.name}</h4>
      <p>${product.brand}</p>
      <p class="price">₹${finalPrice}</p>
      <p>${product.rating} ★</p>
      <p class="${product.stock > 0 ? 'in-stock' : 'out-stock'}">
        ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
      </p>
      <button ${product.stock === 0 ? "disabled" : ""}>
        ${product.stock === 0 ? "Out of Stock" : "Add to Basket"}
      </button>
    `;

    div.querySelector("button")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (product.stock > 0) addToCart(product.id);
    });

    productContainer.appendChild(div);
  });
}

// ================= PAGINATION =================
function setupPagination() {
  pagination.innerHTML = "";
  const pages = Math.ceil(filteredProducts.length / productsPerPage);

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) btn.classList.add("active");

    btn.onclick = () => {
      currentPage = i;
      render();
    };

    pagination.appendChild(btn);
  }
}

// ================= FILTER =================
function getFinalPrice(p) {
  return p.discount
    ? p.price - (p.price * p.discount / 100)
    : p.price;
}

function filterProducts() {
  const search = searchInput.value.toLowerCase();

  const selectedCategories = Array.from(categoryChecks)
    .filter(c => c.checked)
    .map(c => c.value.toLowerCase());

  filteredProducts = products.filter(p => {

    const matchesSearch =
      p.name.includes(search) ||
      p.subCategory.includes(search);

    return (
      matchesSearch &&
      (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
      (!subCategoryFilter.value || p.subCategory === subCategoryFilter.value.toLowerCase()) &&
      (!brandFilter.value || p.brand === brandFilter.value.toLowerCase()) &&
      getFinalPrice(p) <= priceRange.value &&
      (!ratingFilter.value || p.rating >= Number(ratingFilter.value)) &&
      (!inStockFilter.checked || p.stock > 0) &&
      (!discountFilter.value || p.discount >= Number(discountFilter.value))
    );
  });

  // SORT
  if (sortFilter.value === "lowHigh")
    filteredProducts.sort((a,b) => getFinalPrice(a) - getFinalPrice(b));

  if (sortFilter.value === "highLow")
    filteredProducts.sort((a,b) => getFinalPrice(b) - getFinalPrice(a));

  if (sortFilter.value === "rating")
    filteredProducts.sort((a,b) => b.rating - a.rating);

  if (sortFilter.value === "discount")
    filteredProducts.sort((a,b) => (b.discount||0) - (a.discount||0));

  currentPage = 1;
  render();
}

// ================= SEARCH SUGGESTIONS =================
function showSuggestions() {
  const value = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!value) {
    suggestionsBox.classList.add("suggestionsnon");
    return;
  }

  const matches = products
    .filter(p => p.name.includes(value) || p.subCategory.includes(value))
    .slice(0, 5);

  matches.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `${p.name} (${p.subCategory})`;

    div.onclick = () => {
      searchInput.value = p.name;
      suggestionsBox.classList.add("suggestionsnon");

      categoryChecks.forEach(c => {
        c.checked = c.value.toLowerCase() === p.category;
      });

      subCategoryFilter.value = p.subCategory;
      updateBrandFilter();
      filterProducts();
    };

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.classList.remove("suggestionsnon");
}

// ================= EVENTS =================
searchInput.addEventListener("input", () => {
  showSuggestions();
  filterProducts();
});

categoryChecks.forEach(c => {
  c.addEventListener("change", () => {
    updateSubCategoryFilter();
    subCategoryFilter.value = "";
    updateBrandFilter();
    filterProducts();
  });
});

subCategoryFilter.addEventListener("change", () => {
  updateBrandFilter();
  filterProducts();
});

brandFilter.addEventListener("change", filterProducts);
ratingFilter.addEventListener("change", filterProducts);
inStockFilter.addEventListener("change", filterProducts);
discountFilter.addEventListener("change", filterProducts);
sortFilter.addEventListener("change", filterProducts);

priceRange.addEventListener("input", () => {
  priceValue.textContent = priceRange.value;
  filterProducts();
});

// ================= CLEAR =================
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryChecks.forEach(c => c.checked = false);
  subCategoryFilter.value = "";
  brandFilter.value = "";
  ratingFilter.value = "";
  discountFilter.value = "";
  sortFilter.value = "";
  inStockFilter.checked = false;
  priceRange.value = 80000;
  priceValue.textContent = 80000;

  filteredProducts = [...products];
  render();
});

// ================= HELPERS =================
function updateSubCategoryFilter() {
  const selectedCategories = Array.from(categoryChecks)
    .filter(c => c.checked)
    .map(c => c.value.toLowerCase());

  let filtered = products;

  if (selectedCategories.length) {
    filtered = products.filter(p =>
      selectedCategories.includes(p.category)
    );
  }

  const subs = [...new Set(filtered.map(p => p.subCategory))];

  subCategoryFilter.innerHTML = `<option value="">All</option>`;
  subs.forEach(s => {
    subCategoryFilter.innerHTML += `<option value="${s}">${s}</option>`;
  });
}

function updateBrandFilter() {
  const selectedSub = subCategoryFilter.value;

  let filtered = products;

  if (selectedSub) {
    filtered = products.filter(p => p.subCategory === selectedSub);
  }

  const brands = [...new Set(filtered.map(p => p.brand))];

  brandFilter.innerHTML = `<option value="">All Brands</option>`;
  brands.forEach(b => {
    brandFilter.innerHTML += `<option value="${b}">${b}</option>`;
  });
}

// ================= CART =================
function addToCart(id) {
  fetch("http://localhost:3000/api/cart", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ productId: id })
  }).then(() => {
    showToast("Added to cart ✅");
    loadCart();
  });
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
  cartCount.textContent = total;
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

});

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}