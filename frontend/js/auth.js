(function () {
  const isAuthenticated = localStorage.getItem("taskflowAuth") === "true";

  if (!isAuthenticated) {
    window.location.href = "login.html";
  }
})();