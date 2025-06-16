document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.signup-form'); // as in your login.html

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    // Simulated login logic (replace with actual validation if needed)
    console.log('Logging in with:', { username, password });

    // Redirect to dashboard on success
    window.location.href = 'home.html';
  });
});