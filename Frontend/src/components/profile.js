document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const msg = document.createElement("div");
  msg.innerText = "✓ Income and Goal saved! Redirecting to home...";
  msg.className = "success-popup";
  document.body.appendChild(msg);

  // Animate and remove after redirect
  setTimeout(() => {
    msg.classList.add("fade-out");
    setTimeout(() => {
      msg.remove();
      window.location.href = "home.html"; // Adjust if needed
    }, 1000);
  }, 2000);
});





document.querySelector(".edit-pic-btn").addEventListener("click", function () {
  window.location.href = "security.html"; 
});

let currentTooltipId = null;

function toggleTooltip(id) {
  const tooltip = document.getElementById(id);

  document.querySelectorAll('.tooltip-text').forEach(t => t.style.display = 'none');

  if (tooltip.style.display === 'block') {
    tooltip.style.display = 'none';
    currentTooltipId = null;
  } else {
    tooltip.style.display = 'block';
    currentTooltipId = id;
  }
}

function showTrigger(wrapper) {
  const trigger = wrapper.querySelector('.tooltip-trigger');
  if (trigger) {
    trigger.style.visibility = 'visible';
  }
}

function hideTrigger(wrapper) {
  const trigger = wrapper.querySelector('.tooltip-trigger');
  if (trigger && !trigger.matches(':hover')) {
    setTimeout(() => {
      if (!trigger.matches(':hover')) {
        trigger.style.visibility = 'hidden';
      }
    }, 200);
  }
}

// Hide tooltip when cursor enters input
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
form.addEventListener("submit", function (e) {
  e.preventDefault();
  window.location.href = "home.html";
});

// Load username dynamically
window.onload = function () {
  const username = localStorage.getItem("username");
  if (username) {
    document.getElementById("usernameDisplay").innerText = username;
  } else {
    document.getElementById("usernameDisplay").innerText = "User";
  }
};

// Submit form and send to backend
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const income = document.getElementById("income").value;
  const goal = document.getElementById("goal").value;
  const userId = localStorage.getItem("userId"); // ✅ use userId now

  if (!userId) {
    alert("User ID not found. Please log in again.");
    return;
  }

  fetch("http://localhost:5000/api/user/userdata", { // ✅ correct route
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, income, goal }),
  })
    .then((res) => res.json())
    .then((data) => {
      const msg = document.createElement("div");
      msg.innerText = "✓ Income and Goal saved! Redirecting to home...";
      msg.className = "success-popup";
      document.body.appendChild(msg);

      setTimeout(() => {
        msg.classList.add("fade-out");
        setTimeout(() => {
          msg.remove();
          window.location.href = "home.html";
        }, 1000);
      }, 2000);
    })
    .catch((err) => {
      alert("Error saving data: " + err.message);
    });
});


