document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgot-password-form');
  
  // Handle form submission for security question authentication
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const securityQuestion = document.getElementById('security-question').value;
    const securityAnswer = document.getElementById('security-answer').value.trim();
    
    // Validation
    if (!username) {
      showError('Missing Information', 'Please enter your username.');
      return;
    }
    
    if (!securityQuestion) {
      showError('Missing Information', 'Please select a security question.');
      return;
    }
    
    if (!securityAnswer) {
      showError('Missing Information', 'Please enter your security answer.');
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Authenticating...';
    submitBtn.disabled = true;
    
    try {
      console.log('=== FORGOT PASSWORD AUTHENTICATION START ===');
      console.log('Sending data:', { username, securityQuestion, securityAnswer });
      
      const response = await fetch('http://localhost:5000/api/user/security-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          securityQuestion,
          securityAnswer
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Security question authentication successful:', data);
        
        // Store user ID in localStorage for consistency with regular login
        localStorage.setItem('userId', data.user.id);
        
        // Show success message
        showSuccess('Authentication Successful!', 'Redirecting to home page...', 2000);
        
        // Redirect to home page with animation
        setTimeout(() => {
          document.body.style.animation = 'slideOut 0.5s ease forwards';
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 500);
        }, 2000);
        
      } else {
        console.error('❌ Security question authentication failed:', data.message);
        showError('Authentication Failed', data.message || 'Invalid security question or answer.');
      }
      
    } catch (err) {
      console.error('❌ Error during security question authentication:', err);
      showError('Connection Error', 'Unable to connect to server. Please try again.');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Handle all internal <a> links with animation
  document.querySelectorAll('a').forEach(link => {
    if (link.href && link.href.indexOf(window.location.origin) === 0) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => {
          window.location = this.href;
        }, 100);
      });
    }
  });

  // Handle a button that should go to home.html
  const homeBtn = document.getElementById('go-home');
  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.animation = 'slideOut 0.5s ease forwards';
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 100);
    });
  }
});