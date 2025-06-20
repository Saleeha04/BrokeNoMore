document.addEventListener('DOMContentLoaded', function () {
  // Load current income and goal data when page loads
  loadCurrentIncomeGoal();
  // Load current profile picture when page loads
  loadProfilePicture();

  // ✅ TOOLTIP LOGIC
  let currentTooltipId = null;

  window.toggleTooltip = function (id) {
    const tooltip = document.getElementById(id);
    document.querySelectorAll('.tooltip-text').forEach(t => t.style.display = 'none');

    if (tooltip.style.display === 'block') {
      tooltip.style.display = 'none';
      currentTooltipId = null;
    } else {
      tooltip.style.display = 'block';
      currentTooltipId = id;
    }
  };

  window.showTrigger = function (wrapper) {
    const trigger = wrapper.querySelector('.tooltip-trigger');
    if (trigger) trigger.style.visibility = 'visible';
  };

  window.hideTrigger = function (wrapper) {
    const trigger = wrapper.querySelector('.tooltip-trigger');
    if (trigger && !trigger.matches(':hover')) {
      setTimeout(() => {
        if (!trigger.matches(':hover')) {
          trigger.style.visibility = 'hidden';
        }
      }, 200);
    }
  };

  document.querySelectorAll('.input-wrapper input').forEach(input => {
    input.addEventListener('mouseenter', () => {
      if (currentTooltipId) {
        const tooltip = document.getElementById(currentTooltipId);
        if (tooltip) {
          tooltip.style.display = 'none';
          currentTooltipId = null;
        }
      }
    });
  });

  // ✅ PROFILE PICTURE FUNCTIONALITY
  const profileImage = document.getElementById('profileImage');
  const profilePhotoUpload = document.getElementById('profilePhotoUpload');
  const editPicBtn = document.querySelector('.edit-pic-btn');

  // Function to load profile picture from backend
  function loadProfilePicture() {
    fetch("http://localhost:5000/api/user/profile-picture", {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            showWarning('Session Expired', 'Please log in again to continue.');
            setTimeout(() => {
              window.location.href = "login.html";
            }, 3000);
            return;
          }
          if (res.status === 404) {
            return { profilePicture: null };
          }
          throw new Error('Failed to fetch profile picture');
        }
        return res.json();
      })
      .then((data) => {
        if (data.profilePicture) {
          profileImage.src = data.profilePicture;
        } else {
          // Set default profile picture if none exists
          profileImage.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjREREIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiM5OTkiLz4KPC9zdmc+";
        }
      })
      .catch((err) => {
        console.error("Error loading profile picture:", err);
        showError('Profile Error', 'Unable to load profile picture.');
        // Set default profile picture on error
        profileImage.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjREREIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiM5OTkiLz4KPC9zdmc+";
      });
  }

  // Function to upload profile picture to backend
  function uploadProfilePictureToBackend(profilePictureData) {
    // Compress the image to reduce size
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (max 200x200 for profile pictures)
      const maxSize = 200;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
      
      // Upload compressed image
      fetch("http://localhost:5000/api/user/profile-picture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ profilePictureData: compressedDataUrl }),
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              showWarning('Session Expired', 'Please log in again to continue.');
              setTimeout(() => {
                window.location.href = "login.html";
              }, 3000);
              return;
            }
            throw new Error('Failed to upload profile picture');
          }
          return res.json();
        })
        .then((data) => {
          console.log("Profile picture uploaded successfully:", data.message);
          showSuccess('Profile Updated', 'Profile picture uploaded successfully!');
        })
        .catch((err) => {
          console.error("Error uploading profile picture:", err);
          showError('Upload Failed', 'Error uploading profile picture. Please try again.');
        });
    };
    
    img.src = profilePictureData;
  }

  editPicBtn.addEventListener('click', function (e) {
    e.preventDefault();
    profilePhotoUpload.click();
  });

  profilePhotoUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
        // Upload the profile picture to backend
        uploadProfilePictureToBackend(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // ✅ USERNAME DISPLAY
  function loadUsername() {
    const username = localStorage.getItem('username');
    const usernameElement = document.querySelector('.username');
    if (username && usernameElement) {
      usernameElement.textContent = username;
    } else if (!username) {
      // If no username in localStorage, try to fetch it from the server
      fetch("http://localhost:5000/api/user/me", {
        method: "GET",
        credentials: 'include'
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              showWarning('Session Expired', 'Please log in again to continue.');
              setTimeout(() => {
                window.location.href = "login.html";
              }, 3000);
              return;
            }
            throw new Error('Failed to fetch user data');
          }
          return res.json();
        })
        .then((data) => {
          if (data.username && usernameElement) {
            usernameElement.textContent = data.username;
            // Also store in localStorage for future use
            localStorage.setItem('username', data.username);
          }
        })
        .catch((err) => {
          console.error("Error loading user data:", err);
        });
    }
  }

  // Load username when page loads
  loadUsername();

  // ✅ FORM SUBMISSION
  const profileForm = document.getElementById("profileForm");

  // ✅ REAL-TIME VALIDATION FEEDBACK
  const incomeInput = document.getElementById("income");
  const goalInput = document.getElementById("goal");
  let validationMessage = null;

  function showRealTimeValidation() {
    const income = parseFloat(incomeInput.value) || 0;
    const goal = parseFloat(goalInput.value) || 0;
    
    // Remove existing validation message
    if (validationMessage) {
      validationMessage.remove();
      validationMessage = null;
    }

    // Reset input styling
    incomeInput.style.borderColor = '';
    goalInput.style.borderColor = '';

    // Only show validation if both fields have values
    if (income > 0 && goal > 0) {
      if (goal > income) {
        // Highlight the goal input field
        goalInput.style.borderColor = '#ffc107';
        goalInput.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.2)';
        
        validationMessage = document.createElement("div");
        validationMessage.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
            <i class="fas fa-info-circle" style="color: #ffc107;"></i>
            <span>Goal ($${goal.toLocaleString()}) exceeds income ($${income.toLocaleString()})</span>
          </div>
        `;
        validationMessage.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          max-width: 300px;
          font-size: 14px;
        `;
        document.body.appendChild(validationMessage);
      } else {
        // Clear any highlighting when validation passes
        goalInput.style.borderColor = '';
        goalInput.style.boxShadow = '';
      }
    }
  }

  // Add event listeners for real-time validation
  incomeInput.addEventListener('input', showRealTimeValidation);
  goalInput.addEventListener('input', showRealTimeValidation);

  // Clear validation message when inputs lose focus
  incomeInput.addEventListener('blur', () => {
    if (validationMessage) {
      setTimeout(() => {
        if (validationMessage) {
          validationMessage.remove();
          validationMessage = null;
        }
        // Clear input highlighting
        goalInput.style.borderColor = '';
        goalInput.style.boxShadow = '';
      }, 2000);
    }
  });

  goalInput.addEventListener('blur', () => {
    if (validationMessage) {
      setTimeout(() => {
        if (validationMessage) {
          validationMessage.remove();
          validationMessage = null;
        }
        // Clear input highlighting
        goalInput.style.borderColor = '';
        goalInput.style.boxShadow = '';
      }, 2000);
    }
  });

  // Function to load current income and goal data
  function loadCurrentIncomeGoal() {
    fetch("http://localhost:5000/api/user/income-goal", {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            showWarning('Session Expired', 'Please log in again to continue.');
            setTimeout(() => {
              window.location.href = "login.html";
            }, 3000);
            return;
          }
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then((data) => {
        // Populate form fields with current data
        document.getElementById("income").value = data.income || '';
        document.getElementById("goal").value = data.goal || '';
        
        // Update edit count display
        updateEditCountDisplay(data.editCount, data.remainingEdits);
      })
      .catch((err) => {
        console.error("Error loading income/goal data:", err);
        // Don't show alert for new users who haven't set income/goal yet
      });
  }

  // Function to update edit count display
  function updateEditCountDisplay(editCount, remainingEdits) {
    const goalTooltip = document.getElementById('goal-tooltip');
    if (goalTooltip) {
      goalTooltip.innerHTML = `
        This is your financial target. You can update this goal up to 3 times per month (income can be updated unlimited times).<br><br>
        <strong>Current month:</strong><br>
        • Updates used: ${editCount}/3<br>
        • Remaining updates: ${remainingEdits}
      `;
    }
  }

  profileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const income = parseFloat(document.getElementById("income").value);
    const goal = parseFloat(document.getElementById("goal").value);

    // ✅ VALIDATION: Check for valid numeric inputs
    if (isNaN(income) || isNaN(goal)) {
      showError('Invalid Input', 'Please enter valid numbers for both income and goal.');
      return;
    }

    // ✅ VALIDATION: Check for negative values
    if (income < 0 || goal < 0) {
      showError('Invalid Amount', 'Income and goal amounts cannot be negative. Please enter positive values.');
      return;
    }

    // ✅ VALIDATION: Check if goal is greater than income
    if (goal > income) {
      showError('Invalid Savings Goal', `Your savings goal ($${goal.toLocaleString()}) cannot be greater than your income ($${income.toLocaleString()}). Please adjust your goal to be less than or equal to your income.`);
      return; // Stop form submission
    }

    fetch("http://localhost:5000/api/user/userdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ income, goal }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            showWarning('Session Expired', 'Please log in again to continue.');
            setTimeout(() => {
              window.location.href = "login.html";
            }, 3000);
            return;
          }
          return res.json().then(data => {
            throw new Error(data.message || 'Failed to save data');
          });
        }
        return res.json();
      })
      .then((data) => {
        // Update edit count display after successful save
        if (data.editCount !== undefined) {
          updateEditCountDisplay(data.editCount, Math.max(0, 3 - data.editCount));
        }

        let messageText = '';
        
        if (data.incomeUpdated && data.goalUpdated) {
          messageText = 'Income and Goal updated! ';
        } else if (data.incomeUpdated) {
          messageText = 'Income updated! ';
        } else if (data.goalUpdated) {
          messageText = 'Goal updated! ';
        } else {
          messageText = 'No changes made. ';
        }
        
        if (data.goalUpdated) {
          messageText += `(${data.editCount}/3 goal updates used this month) `;
        }
        
        messageText += 'Redirecting to home...';
        
        showSuccess('Profile Updated', messageText, 2000);

        setTimeout(() => {
          // Set a flag in localStorage to indicate that income/goal was updated
          localStorage.setItem('incomeGoalUpdated', 'true');
          window.location.href = "home.html";
        }, 2000);
      })
      .catch((err) => {
        showError('Save Failed', err.message);
        
        // Auto-redirect to homepage after error (especially for edit limit errors)
        if (err.message.includes('maximum limit of 3 goal updates')) {
          setTimeout(() => {
            window.location.href = "home.html";
          }, 3000);
        }
      });
  });
});