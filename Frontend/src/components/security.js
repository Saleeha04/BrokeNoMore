// Show initial delete confirmation modal
document.querySelector(".delete").addEventListener("click", function () {
  document.getElementById("confirmDeleteModal").style.display = "flex";
  document.body.classList.add("modal-open");
});

// Confirm delete → ask for password
document.getElementById("confirmYes").addEventListener("click", function () {
  document.getElementById("confirmDeleteModal").style.display = "none";
  document.getElementById("passwordModal").style.display = "flex";
  document.body.classList.add("modal-open");
});

// Cancel from first modal
document.getElementById("confirmCancel").addEventListener("click", function () {
  document.getElementById("confirmDeleteModal").style.display = "none";
  document.body.classList.remove("modal-open");
});

// Cancel from password modal
document.getElementById("cancelDelete").addEventListener("click", function () {
  document.getElementById("passwordModal").style.display = "none";
  document.body.classList.remove("modal-open");
});

// Final delete action
document.getElementById("submitDelete").addEventListener("click", function () {
  const password = document.getElementById("confirmPassword").value;

  if (password.trim() === "") {
    alert("Please enter your password.");
    return;
  }

  document.body.classList.remove("modal-open");
  alert("Your account has been deleted.");
  window.location.href = "landingPage.html"; // redirect to landing page
});

// Save security form
document.getElementById("securityForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Security details saved!");
});

 // backButton.js

document.addEventListener("DOMContentLoaded", function () {
  const backBtn = document.getElementById("backToProfileBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "profile.html"; // adjust if path is different
    });
  }
});

 
    document.addEventListener('DOMContentLoaded', function() {
      const profileImage = document.getElementById('profileImage');
      const editPicBtn = document.querySelector('.edit-pic-btn');
      const profilePhotoUpload = document.getElementById('profilePhotoUpload');
      
      // Handle edit button click
      editPicBtn.addEventListener('click', function() {
        profilePhotoUpload.click();
      });
      
      // Handle file selection
      profilePhotoUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(event) {
            profileImage.src = event.target.result;
          };
          
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    });
  


