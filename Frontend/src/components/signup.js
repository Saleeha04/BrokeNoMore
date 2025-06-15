document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.signup-form');
  const questionSelect = document.getElementById('security-question');
  const answerContainer = document.getElementById('answer-container');
  const answerInput = document.getElementById('security-answer');

  // Hide answer field initially
  answerContainer.style.display = 'none';
  answerInput.required = false;

  // Show/hide security answer based on question
  questionSelect.addEventListener('change', () => {
    if (questionSelect.value !== '') {
      answerContainer.style.display = 'block';
      answerInput.required = true;
    } else {
      answerContainer.style.display = 'none';
      answerInput.value = '';
      answerInput.required = false;
    }
  });

  // Toggle password visibility
  const passwordInput = document.getElementById('password');
  const togglePassword = document.createElement('span');
  togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
  togglePassword.style.cursor = 'pointer';
  togglePassword.style.position = 'absolute';
  togglePassword.style.right = '10px';
  togglePassword.style.top = '38px';

  const passwordFieldWrapper = passwordInput.parentElement;
  passwordFieldWrapper.style.position = 'relative';
  passwordFieldWrapper.appendChild(togglePassword);

  togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      passwordInput.type = 'password';
      togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm-password').value.trim();
    const securityQuestion = questionSelect.value;
    const securityAnswer = answerInput.value.trim();

    // Validation
    if (username.length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    }

    if (!email.includes('@') || email.length < 5) {
      alert("Please enter a valid email.");
      return;
    }

    if (password.length < 5) {
      alert("Password must be at least 5 characters.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    if (!securityQuestion || !securityAnswer) {
      alert("Please select a security question and provide an answer.");
      return;
    }

    try {
      // ✅ Check if email exists
      console.log("Checking email:", email);

      const checkRes = await fetch(`http://localhost:5000/api/users/check-email?email=${encodeURIComponent(email)}`);

      const checkData = await checkRes.json();
      if (checkData.exists) {
        alert("This email is already registered.");
        return;
      }

      // ✅ Register the user
      const payload = { username, email, password, securityQuestion, securityAnswer };

      const signupRes = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await signupRes.json();
      if (signupRes.ok ) {
        alert("Signup successful!");
        window.location.href = "login.html";
      } else {
        alert("Signup failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during signup.");
    }
  });
});
