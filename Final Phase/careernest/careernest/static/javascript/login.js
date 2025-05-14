// login.js
// const loginForm = document.querySelector('.login-form form');
const formsignup = document.getElementById("loginForm");
let users = JSON.parse(localStorage.getItem("users")) || [];

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.querySelector("#login-username").value.trim();
  const password = document.querySelector("#login-password").value;

  clearErrors();

  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    showError("login-username", "Invalid username");
    return;
  }

  if (user.password !== password) {
    showError("login-password", "Invalid password");
    return;
  }

  // Successful login
  showToast(`Welcome back, ${username}!`, "success");

  setTimeout(() => {
    // localStorage.setItem("currentUser", JSON.stringify(user));
    if (user.userType === "option1") {
      window.location.href = "user-dashboard.html";
    } else if (user.userType === "option2") {
      window.location.href = "company-dashboard.html";
    }
  }, 2000);
});

// Error handling functions (same as signup)
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  field.parentElement.appendChild(error);
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((error) => error.remove());
}

// Toast function (same as signup)
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.backgroundColor =
    type === "error"
      ? "var(--danger-color)"
      : type === "warning"
      ? "var(--warning-color)"
      : "var(--success-color)";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

const passwordInput = document.getElementById('login-password');
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', function () {
  // Toggle the type attribute
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  // Toggle the eye / eye-slash icon
  this.classList.toggle('uil-eye');
  this.classList.toggle('uil-eye-slash');
});