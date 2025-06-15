document.addEventListener('DOMContentLoaded', () => {
  function setupToggle(eyeId, inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(eyeId);

    toggle.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.classList.toggle('fa-eye');
      toggle.classList.toggle('fa-eye-slash');
    });
  }

  setupToggle('toggle-password', 'password');
  setupToggle('toggle-confirm-password', 'confirm-password');

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.href && this.href.indexOf(window.location.origin) === 0) {
        e.preventDefault();
        document.body.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => {
          window.location = this.href;
        }, 100);
      }
    });
  });
});
