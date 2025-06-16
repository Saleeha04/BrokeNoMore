document.addEventListener('DOMContentLoaded', () => {
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


  const questionSelect = document.getElementById('security-question');
  const answerContainer = document.getElementById('answer-container');
  const answerInput = document.getElementById('security-answer');

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


  const form = document.querySelector('.signup-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const selectedQuestion = questionSelect.value;
    const answer = answerInput.value.trim();

    if (!username || !password || !selectedQuestion || !answer) {
      alert('Please fill in all fields!');
      return;
    }


    const payload = {
      username,
      password,
      securityQuestion: selectedQuestion,
      securityAnswer: answer
    };

    console.log('Sending to backend:', payload);

    // Example: simulate sending (replace this with actual fetch/ajax later)
    alert(`Submitted!\nUsername: ${username}\nQuestion: ${selectedQuestion}\nAnswer: ${answer}`);

    // Optionally: you can POST this to your backend:
    /*
    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // redirect or show success message
    })
    .catch(error => {
      console.error('Error:', error);
    });
    */
  });

  // Optional: Navbar menu click
  // const menu = document.querySelector('.menu');
  // menu.addEventListener('click', () => {
  //   alert('Menu button clicked! You can implement sidebar here.');
  // });
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

