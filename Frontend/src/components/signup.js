document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (username.length < 5) {
      alert('Username must be at least 5 characters long.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // All checks passed — redirect to login page
    window.location.href = 'login.html';
  });

  // Optional: link transition animation
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
