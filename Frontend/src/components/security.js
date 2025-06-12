function updateCount() {
    const answerInput = document.getElementById("answer");
    const count = document.getElementById("count");
    count.textContent = answerInput.value.length;
  }
  
  
  
  document.getElementById("securityForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Security details saved!");
  });
  
  document.querySelector(".delete-btn").addEventListener("click", function () {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      alert("Account deleted.");
      // Add deletion logic here
    }
  });
  