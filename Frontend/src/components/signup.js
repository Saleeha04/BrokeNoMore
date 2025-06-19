document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const securityQuestion = document.getElementById('security-question').value;
    const securityAnswer = document.getElementById('security-answer').value;

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

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, securityQuestion, securityAnswer })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = 'login.html';
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error registering user');
    }
  });

  // Keep the link transition animation code
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