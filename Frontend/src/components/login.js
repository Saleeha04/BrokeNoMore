const togglePassword = document.getElementById("toggle-password");
const passwordField = document.getElementById("password");

if (togglePassword && passwordField) {
  togglePassword.addEventListener("click", function () {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById("toggle-password");
  const passwordField = document.getElementById("password");

  togglePassword.addEventListener("click", function () {
    const isPassword = passwordField.type === "password";
    passwordField.type = isPassword ? "text" : "password";
    this.textContent = isPassword ? "🙈" : "👁️";
  });
});

