const formsignup = document.getElementById("formsignup");
let users = JSON.parse(localStorage.getItem('users')) || [];

// users.push({ username: "marco", email: "marco@example.com" }); //testing 

formsignup.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmpass = document.getElementById("confirmpass").value;
  const email = document.getElementById("email").value.trim();
  const userType = document.getElementById("choice").value;

  // Clear the past errors
  clearErrors();

  if (!validateUsername(username)) return;

  if (!validateEmail(email)) return;

  if (!validatePassword(password)) return;

  if (password !== confirmpass) {
    showError("confirmpass", "Passwords do not match");
    return;
  }

  // Create user object
  const newUser = {
    username,
    password,
    email,
    userType
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
//   alert("Registration successful!");
  showToast('Registration successful!');
  formsignup.reset();
    // Redirection logic
    setTimeout(() => {
      if (userType === 'option1') {
        window.location.href = '/user-dashboard/';
      } else if (userType === 'option2') {
        window.location.href = '/company-dashboard/';
      }
    }, 1000);
});

function validateUsername(username) {
  if (username.length < 8) {
    showError("username", "Username must be at least 8 characters");
    return false;
  }
  
  const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
  if (existingUser) {
    showError("username", "Username already taken");
    return false;
  }
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("email", "Invalid email format");
    return false;
  }
  
  const existingEmail = users.find(user => user.email === email);
  if (existingEmail) {
    showError("email", "Email already registered");
    return false;
  }
  return true;
}

function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) {
    showError("password", `Password must be at least ${minLength} characters`);
    return false;
  }
  if (!hasUpperCase.test(password)) {
    showError("password", "Password must contain at least one uppercase letter");
    return false;
  }
  if (!hasNumber.test(password)) {
    showError("password", "Password must contain at least one number");
    return false;
  }
  if (!hasSpecialChar.test(password)) {
    showError("password", "Password must contain at least one special character");
    return false;
  }
  return true;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.createElement("div");
  error.className = "error-message";
  error.style.color = "red";
  error.style.fontSize = "0.8rem";
  error.textContent = message;
  field.parentElement.appendChild(error);
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach(error => error.remove());
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = 
        type === 'error' ? 'var(--danger-color)' :
        type === 'warning' ? 'var(--warning-color)' :
        'var(--success-color)';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', function () {
  // Toggle the type attribute
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  // Toggle the eye / eye-slash icon
  this.classList.toggle('uil-eye');
  this.classList.toggle('uil-eye-slash');
});

const passwordInput2 = document.getElementById('confirmpass');
const togglePassword2 = document.getElementById('toggle-password2');

togglePassword2.addEventListener('click', function () {
  // Toggle the type attribute
  const type = passwordInput2.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput2.setAttribute('type', type);
  
  // Toggle the eye / eye-slash icon
  this.classList.toggle('uil-eye');
  this.classList.toggle('uil-eye-slash');
});