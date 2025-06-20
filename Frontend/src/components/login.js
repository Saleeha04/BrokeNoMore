document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.signup-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      showError('Login Error', 'Please enter both username and password.');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // ✅ Required for session cookie
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);
        console.log('✅ Login successful:', data);
        
        showSuccess('Welcome Back!', 'Login successful. Redirecting to dashboard...', 2000);
        
        setTimeout(() => {
          window.location.href = 'home.html'; // ✅ redirect to dashboard
        }, 2000);
      } else {
        showError('Login Failed', data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('❌ Error during login:', err);
      showError('Connection Error', 'Unable to connect to server. Please try again.');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});




// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.querySelector('.signup-form');


//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const username = document.getElementById('username').value.trim();
//     const password = document.getElementById('password').value.trim();

//     if (!username || !password) {
//       alert('Please enter both username and password.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//       });

//       const text = await response.text(); // Log raw response
//       console.log('Raw response:', text);

//       let data;
//       try {
//         data = JSON.parse(text); // Manually parse to catch errors
//       } catch (parseErr) {
//         console.error('Failed to parse JSON:', parseErr);
//         throw new Error('Invalid server response');
//       }

//       if (response.ok) {
//         console.log('Login successful:', data);
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userId', data.userId);
//         window.location.href = 'home.html';
//       } else {
//         alert(data.message || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       alert('An error occurred. Check console for details.');
//     }
//   });
// });