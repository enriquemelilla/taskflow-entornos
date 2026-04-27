const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("username-error");
const passwordError = document.getElementById("password-error");
const loginMessage = document.getElementById("login-message");

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("taskflowAuth") === "true") {
    window.location.href = "index.html";
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearLoginValidation();
  showLoginMessage("", "");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  let isValid = true;

  if (!username) {
    setFieldError(usernameInput, usernameError, "El usuario es obligatorio");
    isValid = false;
  }

  if (!password) {
    setFieldError(passwordInput, passwordError, "La contraseña es obligatoria");
    isValid = false;
  }

  if (!isValid) {
    showLoginMessage("Revisa los datos de acceso", "error");
    return;
  }

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    localStorage.setItem("taskflowAuth", "true");
    localStorage.setItem("taskflowUser", username);
    window.location.href = "index.html";
    return;
  }

  showLoginMessage("Usuario o contraseña incorrectos", "error");
});

function clearLoginValidation() {
  clearFieldError(usernameInput, usernameError);
  clearFieldError(passwordInput, passwordError);
}

function clearFieldError(inputElement, errorElement) {
  if (inputElement) {
    inputElement.classList.remove("input-error");
  }

  if (errorElement) {
    errorElement.textContent = "";
  }
}

function setFieldError(inputElement, errorElement, message) {
  if (inputElement) {
    inputElement.classList.add("input-error");
  }

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function showLoginMessage(message, type) {
  if (!message) {
    loginMessage.textContent = "";
    loginMessage.className = "message";
    return;
  }

  loginMessage.textContent = message;
  loginMessage.className = "message";
  loginMessage.classList.add(type);
}