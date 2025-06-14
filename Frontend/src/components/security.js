function updateCount() {
    const answerInput = document.getElementById("answer");
    const count = document.getElementById("count");
    count.textContent = answerInput.value.length;
  }
  
  
  
  document.getElementById("securityForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Security details saved!");
  });
  
  document.querySelector(".delete").addEventListener("click", function () {
    document.getElementById("confirmDeleteModal").style.display = "flex";
  });
  
  document.getElementById("confirmYes").addEventListener("click", function () {
    document.getElementById("confirmDeleteModal").style.display = "none";
    document.getElementById("passwordModal").style.display = "flex";
  });
  
  document.getElementById("confirmCancel").addEventListener("click", function () {
    document.getElementById("confirmDeleteModal").style.display = "none";
  });
  
  document.getElementById("cancelDelete").addEventListener("click", function () {
    document.getElementById("passwordModal").style.display = "none";
  });
  
  document.getElementById("submitDelete").addEventListener("click", function () {
    const password = document.getElementById("confirmPassword").value;
  
    if (password.trim() === "") {
      alert("Please enter your password.");
      return;
    }
    // When modal opens
document.body.classList.add("modal-open");

// When modal closes
document.body.classList.remove("modal-open");

  
    // Simulate account deletion
    alert("Your account has been deleted.");
    window.location.href = "landingPage.html"; // Change this to your actual landing page
  });
  
  