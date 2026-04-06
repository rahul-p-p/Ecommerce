// ================= VALIDATION HELPERS =================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return /^(?=.*\d).{6,}$/.test(password);
}

function setError(input, errorId, message) {
  const error = document.getElementById(errorId);

  if (message) {
    error.textContent = message;
    input.classList.add("invalid");
    input.classList.remove("valid");
  } else {
    error.textContent = "";
    input.classList.add("valid");
    input.classList.remove("invalid");
  }
}

// ================= TOUCH STATE =================

const touched = {
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
  loginEmail: false,
  loginPassword: false
};

// ================= VALIDATORS (same as yours) =================

function validateUsername() {
  const input = document.getElementById("username");
  if (!input) return true;

  if (!input.value.trim()) {
    setError(input, "usernameError", "Username required");
    return false;
  }

  setError(input, "usernameError", "");
  return true;
}

function validateEmail() {
  const input = document.getElementById("email");
  if (!input) return true;

  const value = input.value.trim();

  if (!value) {
    setError(input, "emailError", "Email required");
    return false;
  }

  if (!isValidEmail(value)) {
    setError(input, "emailError", "Invalid email");
    return false;
  }

  setError(input, "emailError", "");
  return true;
}

function validatePassword() {
  const input = document.getElementById("password");
  if (!input) return true;

  if (!input.value) {
    setError(input, "passwordError", "Password required");
    return false;
  }

  if (!isStrongPassword(input.value)) {
    setError(input, "passwordError", "Min 6 chars + 1 number");
    return false;
  }

  setError(input, "passwordError", "");
  return true;
}

function validateConfirmPassword() {
  const input = document.getElementById("confirmPassword");
  const password = document.getElementById("password")?.value;

  if (!input) return true;

  if (!input.value) {
    setError(input, "confirmError", "Confirm your password");
    return false;
  }

  if (input.value !== password) {
    setError(input, "confirmError", "Passwords do not match");
    return false;
  }

  setError(input, "confirmError", "");
  return true;
}

// LOGIN VALIDATORS

function validateLoginEmail() {
  const input = document.getElementById("loginEmail");
  if (!input) return true;

  if (!input.value.trim()) {
    setError(input, "loginEmailError", "Email required");
    return false;
  }

  if (!isValidEmail(input.value)) {
    setError(input, "loginEmailError", "Invalid email");
    return false;
  }

  setError(input, "loginEmailError", "");
  return true;
}

function validateLoginPassword() {
  const input = document.getElementById("loginPassword");
  if (!input) return true;

  if (!input.value) {
    setError(input, "loginPasswordError", "Password required");
    return false;
  }

  setError(input, "loginPasswordError", "");
  return true;
}

// ================= EVENT BINDING =================

function bindValidation(inputId, validateFn, key) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("blur", () => {
    touched[key] = true;
    validateFn();
  });

  input.addEventListener("input", () => {
    if (touched[key]) validateFn();
  });
}

bindValidation("username", validateUsername, "username");
bindValidation("email", validateEmail, "email");
bindValidation("password", validatePassword, "password");
bindValidation("confirmPassword", validateConfirmPassword, "confirmPassword");

bindValidation("loginEmail", validateLoginEmail, "loginEmail");
bindValidation("loginPassword", validateLoginPassword, "loginPassword");

// ================= SIGNUP (API CALL) =================

async function signup() {
  const isValid =
    validateUsername() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword();

  if (!isValid) return;

  const user = {
    username: document.getElementById("username").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert("Signup successful!");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ================= ADMIN =================

const ADMIN = {
  email: "admin@shop.com",
  password: "admin123"
};

// ================= LOGIN (API VERSION) =================

async function login() {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  console.log("Entered:", email, password);

  // ADMIN CHECK
  if (
    email.toLowerCase() === ADMIN.email &&
    password === ADMIN.password
  ) {
    window.location.href = "/admin/dashboard.html";
    return;
  }

  const isValid =
    validateLoginEmail() &&
    validateLoginPassword();

  if (!isValid) return;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("Server response:", data);

    if (!data.success) {
      setError(emailInput, "loginEmailError", data.message);
      return;
    }

    // ROLE ROUTING
    if (data.role === "seller") {
      window.location.href = "/seller/dashboard.html";
    } else if (data.role === "customer") {
      window.location.href = "/customer/index.html";
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ================= PASSWORD TOGGLE =================

function togglePassword(id, el) {
  const input = document.getElementById(id);

  input.type = input.type === "password" ? "text" : "password";
  el.textContent = input.type === "password" ? "👁" : "🙈";
}