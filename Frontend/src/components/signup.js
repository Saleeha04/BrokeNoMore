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
      showError('Username Error', 'Username must be at least 5 characters long.');
      return;
    }

    if (password.length < 8) {
      showError('Password Error', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match.');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, securityQuestion, securityAnswer })
      });

      const data = await response.json();
      if (response.ok) {
        showSuccess('Account Created!', 'Registration successful. Redirecting to login...', 3000);
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3000);
      } else {
        showError('Registration Failed', data.message || 'Failed to create account.');
      }
    } catch (err) {
      showError('Connection Error', 'Unable to connect to server. Please try again.');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
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