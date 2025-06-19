// import { renderDonutChart } from './chart-help.js';

let donutChart = null;

// Function to format date as YYYY/MM/DD
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function renderDonutChart() {
  const expenseTableBody = document.querySelector(".expense-table");
  const rows = expenseTableBody.querySelectorAll("tr");

  const categoryTotals = {};

  rows.forEach(row => {
    const category = row.cells[2]?.textContent?.trim();
    const amount = parseFloat(row.cells[3]?.textContent?.trim()) || 0;

    if (category) {
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const ctx = document.getElementById('donut-chart')?.getContext('2d');
  if (!ctx) return;

  if (donutChart) {
    donutChart.destroy();
  }

  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Expense Distribution',
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#9AD0F5', '#FF6666'
        ],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 1200,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Expenses by Category'
        }
      }
    }
  });
}

// Array of tips to display
const tips = [
  "Did you know? Setting a monthly budget can help you save up to 20% more!",
  "Tip: Track every expense, no matter how small - they add up quickly!",
  "Pro tip: Save at least 10% of your income for emergencies.",
  "Remember: Review your expenses weekly to stay on track with your goals.",
  "Smart move: Automate your savings to make it effortless.",
  "Try this: Use the 50/30/20 rule - 50% needs, 30% wants, 20% savings.",
  "Helpful hint: Cooking at home can save you hundreds each month!",
  "Good practice: Pay off high-interest debts as quickly as possible.",
  "Financial tip: Compare prices before making big purchases.",
  "Wise advice: Start investing early, even if it's small amounts."
];

// Display a random financial tip
function getRandomTip() {
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

function displayTip() {
  const tipElement = document.getElementById('tip-text');
  if (tipElement) {
    tipElement.textContent = getRandomTip();
    setInterval(() => {
      tipElement.textContent = getRandomTip();
    }, 15000);
  }
}

window.addEventListener('DOMContentLoaded', displayTip);

// Recurring logic
const recurringCheckbox = document.getElementById('recurring-checkbox');
const recurringDetails = document.getElementById('recurring-details');
const rateSelect = document.getElementById('rate');

if (recurringCheckbox) {
  recurringCheckbox.addEventListener("change", () => {
    if (recurringCheckbox.checked) {
      recurringDetails.style.display = "block";
      rateSelect.setAttribute("required", "true");
    } else {
      recurringDetails.style.display = "none";
      rateSelect.removeAttribute("required"); // <-- this again
    }
  });

}


document.addEventListener("DOMContentLoaded", () => {
  // Load user data and income/goal information
  loadUserData();
  loadIncomeGoalData();
  loadProfilePicture();

  // Check if we're returning from profile page with updated income/goal
  if (localStorage.getItem('incomeGoalUpdated') === 'true') {
    // Clear the flag
    localStorage.removeItem('incomeGoalUpdated');
    // Refresh the income/goal display after a short delay to ensure data is updated
    setTimeout(() => {
      loadIncomeGoalData();
    }, 500);
  }

  const plusBtn = document.querySelector(".plus-btn");
  const modal = document.getElementById("entry-modal");
  const closeBtn = document.querySelector(".close-btn");
  const expenseForm = document.getElementById("expense-form");
  const expenseTableBody = document.querySelector(".expense-table tbody");
  const upcomingTableBody = document.querySelector(".upcoming-table tbody");


  const filterBtn = document.getElementById("filter-btn");
  const filterInput = document.getElementById("filter-input");

  const recurringCheckbox = document.getElementById("recurring-checkbox");
  const recurringDetails = document.getElementById("recurring-details");

  // Function to load user data
  function loadUserData() {
    fetch("http://localhost:5000/api/user/me", {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            alert("Session expired. Please log in again.");
            window.location.href = "login.html";
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        return res.json();
      })
      .then((data) => {
        // Update username display while preserving the edit button
        const usernameElement = document.querySelector(".username");
        if (usernameElement) {
          // Preserve the edit button by only updating the text content
          const editButton = usernameElement.querySelector('.edit-profile-link');
          usernameElement.innerHTML = '';
          usernameElement.appendChild(document.createTextNode(data.username || 'Username'));
          if (editButton) {
            usernameElement.appendChild(editButton);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading user data:", err);
      });
  }

  // Function to load profile picture
  function loadProfilePicture() {
    fetch("http://localhost:5000/api/user/profile-picture", {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            alert("Session expired. Please log in again.");
            window.location.href = "login.html";
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
        const profilePicElement = document.querySelector(".profile-pic");
        if (profilePicElement) {
          // Create an img element if it doesn't exist
          let imgElement = profilePicElement.querySelector('img');
          if (!imgElement) {
            imgElement = document.createElement('img');
            imgElement.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            `;
            profilePicElement.appendChild(imgElement);
          }
          // Set profile picture or default
          if (data.profilePicture) {
            imgElement.src = data.profilePicture;
          } else {
            // Set a default background color or placeholder
            imgElement.style.display = 'none';
            profilePicElement.style.backgroundColor = '#ddd';
          }
        }
      })
      .catch((err) => {
        console.error("Error loading profile picture:", err);
      });
  }

  // Function to load income and goal data
  function loadIncomeGoalData() {
    fetch("http://localhost:5000/api/user/income-goal", {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            alert("Session expired. Please log in again.");
            window.location.href = "login.html";
            return;
          }
          throw new Error('Failed to fetch income/goal data');
        }
        return res.json();
      })
      .then((data) => {
        // Update the profile section with income and goal data
        updateProfileWithIncomeGoal(data);
      })
      .catch((err) => {
        console.error("Error loading income/goal data:", err);
      });
  }

  // Function to update profile section with income and goal data
  function updateProfileWithIncomeGoal(data) {
    const userInfoElement = document.querySelector(".user-info");
    if (userInfoElement) {
      // Keep the username (first child)
      const usernameElement = userInfoElement.querySelector(".username");
      
      // Clear existing content except username
      userInfoElement.innerHTML = '';
      if (usernameElement) {
        userInfoElement.appendChild(usernameElement);
      }
      
      // Add income display
      const incomeElement = document.createElement('div');
      incomeElement.className = 'income-display';
      incomeElement.innerHTML = `<span>Income: $${data.income || 0}</span>`;
      userInfoElement.appendChild(incomeElement);
      
      // Add goal display
      const goalElement = document.createElement('div');
      goalElement.className = 'goal-display';
      goalElement.innerHTML = `<span>Goal: $${data.goal || 0}</span>`;
      userInfoElement.appendChild(goalElement);
    }
  }

  // Function to refresh income/goal display (can be called from other pages)
  function refreshIncomeGoalDisplay() {
    loadIncomeGoalData();
  }

  // Make the function globally available so other pages can call it
  window.refreshIncomeGoalDisplay = refreshIncomeGoalDisplay;

  function closeModal() {
    modal.classList.add("hidden");
    expenseForm.reset();
    recurringDetails.style.display = "none";
    rateSelect.removeAttribute('required'); // <-- this line is critical
    rowBeingEdited = null;
    editingUpcoming = false;
  }

  let rowBeingEdited = null;
  let editingUpcoming = false;
  let editingExpenseId = null;

  // Function to set date constraints for current month
  function setDateConstraints() {
    const dateInput = expenseForm.date;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Format dates as YYYY-MM-DD for input constraints
    const minDate = firstDayOfMonth.toISOString().slice(0, 10);
    const maxDate = lastDayOfMonth.toISOString().slice(0, 10);
    
    console.log('Setting date constraints:', { minDate, maxDate, currentDate: now.toISOString().slice(0, 10) });
    
    dateInput.min = minDate;
    dateInput.max = maxDate;
    
    // Force the input to refresh by temporarily clearing and resetting
    const currentValue = dateInput.value;
    dateInput.value = '';
    dateInput.value = currentValue || now.toISOString().slice(0, 10);
    
    console.log('Date input constraints set:', { min: dateInput.min, max: dateInput.max, value: dateInput.value });
  }

  recurringCheckbox.addEventListener("change", () => {
    recurringDetails.style.display = recurringCheckbox.checked ? "block" : "none";
  });

  plusBtn.addEventListener("click", () => {
    rowBeingEdited = null;
    editingUpcoming = false;
    setDateConstraints();
    modal.classList.remove("hidden");
  });


  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log(expenseForm.date.value)
    const title = expenseForm.title.value;
    const date = expenseForm.date.value;
    const category = expenseForm.category.value;
    const amount = expenseForm.amount.value;
    const isRecurring = recurringCheckbox.checked;
    const rate = isRecurring ? rateSelect.value : "";
    const isUpcoming = isRecurring;

    const newRow = document.createElement("tr");

    // BACKEND SHENINANGINS

    const userId = localStorage.getItem('userId');
    const payload = {
      userId,
      title,
      date,
      category,
      amount,
      isRecurring,
      rate
    };

    const method = editingExpenseId ? 'PUT' : 'POST';
    const url = editingExpenseId
      ? `http://localhost:5000/api/expenses/${editingExpenseId}`
      : `http://localhost:5000/api/expenses`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Expense saved:", data);
        getExpenses(); // ✅ re-render tables
        renderDonutChart(); // ✅ keep chart fresh
      })
      
      .catch(err => {
        console.error("Error sending expense data:", err);
      });

    // BACKEND SHENINAGINS

    // newRow.innerHTML = getRowHTML(date, title, category, rate, amount, isUpcoming);

    // if (rowBeingEdited) {
    //   rowBeingEdited.remove(); // 🔄 remove old row to handle switch between tables
    // }

    // (isUpcoming ? upcomingTableBody : expenseTableBody).appendChild(newRow);
    // attachRowListeners(newRow, isUpcoming);
    closeModal();
  });

  function getRowHTML(date, title, category, rate, amount, isUpcoming) {
    return isUpcoming ? `
      <td>${date}</td>
      <td>${title}</td>
      <td>${category}</td>
      <td>${rate}</td>
      <td>${amount}</td>
      <td>
      <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
      <button class="edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
      <button class="mark-paid-btn" title="Mark as Paid"><i class="fas fa-check"></i></button>
      </td>
    ` : `
      <td>${date}</td>
      <td>${title}</td>
      <td>${category}</td>
      <td>${amount}</td>
      <td>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
        <button class="edit-btn"><i class="fas fa-pen"></i></button>
      </td>
    `;
  }

  function attachRowListeners(row, isUpcoming) {
    const deleteBtn = row.querySelector(".delete-btn");
    const editBtn = row.querySelector(".edit-btn");
    const markPaidBtn = row.querySelector(".mark-paid-btn");

    deleteBtn.addEventListener("click", () => {

      // Backend: Deleting
      const expenseId = row.dataset.id;
      fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
        .then(res => res.json)
        .then(data => {
          console.log(data.message);
          getExpenses();
          renderDonutChart();
        }).catch(err => console.log('Error deleting', err));
    });

    editBtn.addEventListener("click", () => {
      rowBeingEdited = row;
      editingUpcoming = isUpcoming;
      editingExpenseId = row.dataset.id; // ✅ Store ID for form submission

      const cells = row.querySelectorAll("td");
      const existingDate = new Date(cells[0].textContent);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      console.log('Edit button clicked:', {
        existingDate: cells[0].textContent,
        parsedExistingDate: existingDate.toISOString().slice(0, 10),
        currentYear,
        currentMonth,
        firstDayOfMonth: firstDayOfMonth.toISOString().slice(0, 10),
        lastDayOfMonth: lastDayOfMonth.toISOString().slice(0, 10)
      });
      
      // Always set constraints to current month
      expenseForm.date.min = firstDayOfMonth.toISOString().slice(0, 10);
      expenseForm.date.max = lastDayOfMonth.toISOString().slice(0, 10);
      
      // Check if existing date is within current month
      const existingDateObj = new Date(existingDate);
      const isInCurrentMonth = existingDateObj.getFullYear() === currentYear && 
                              existingDateObj.getMonth() === currentMonth;
      
      console.log('Date validation:', {
        existingDateYear: existingDateObj.getFullYear(),
        existingDateMonth: existingDateObj.getMonth(),
        isInCurrentMonth,
        willUseExistingDate: isInCurrentMonth
      });
      
      if (isInCurrentMonth) {
        expenseForm.date.value = existingDate.toISOString().slice(0, 10);
      } else {
        expenseForm.date.value = now.toISOString().slice(0, 10);
      }
      
      console.log('Final date input state:', {
        min: expenseForm.date.min,
        max: expenseForm.date.max,
        value: expenseForm.date.value
      });
      
      expenseForm.title.value = cells[1].textContent;
      expenseForm.category.value = cells[2].textContent;

      if (isUpcoming) {
        recurringCheckbox.checked = true;
        recurringDetails.style.display = "block";
        document.getElementById("rate").value = cells[3].textContent;
        expenseForm.amount.value = cells[4].textContent;
      } else {
        recurringCheckbox.checked = false;
        recurringDetails.style.display = "none";
        expenseForm.amount.value = cells[3].textContent;
      }

      modal.classList.remove("hidden");
    });

    if (isUpcoming && markPaidBtn) {
      markPaidBtn.addEventListener("click", () => {
        const expenseId = row.dataset.id;

        fetch(`http://localhost:5000/api/expenses/mark-paid/${expenseId}`, {
          method: 'POST', 
          credentials: 'include'
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to mark as paid');
            return res.json();
          })
          .then(data => {
            console.log(data.message);
            getExpenses();
            renderDonutChart();
          })
          .catch(err => console.error('Error marking as paid:', err));
        

      });
    }



  }

  filterBtn.addEventListener("click", () => {
    const isVisible = filterInput.style.display !== "none";
    filterInput.style.display = isVisible ? "none" : "inline-block";

    if (!isVisible) {
      filterInput.focus();
    } else {
      filterInput.value = '';
      filterExpenses('');
    }
  });

  filterInput.addEventListener("input", () => {
    const query = filterInput.value.trim().toLowerCase();
    filterExpenses(query);
  });

  function filterExpenses(query) {
    const rows = Array.from(expenseTableBody.querySelectorAll("tr"));
    rows.forEach(row => {
      const categoryCell = row.querySelector("td:nth-child(3)");
      const categoryText = categoryCell?.textContent?.toLowerCase() || "";
      row.style.display = categoryText.includes(query) ? "" : "none";
    });
  }

  getExpenses();

  function getExpenses() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not logged in. Please log in again.");
      window.location.href = "login.html";
      return;
    }
    fetch(`http://localhost:5000/api/expenses/${userId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json(); // <-- fails if no content returned
      })
      .then(data => {
        console.log("Fetched normal expenses:", data);

        expenseTableBody.innerHTML = ""; // Clear old rows
        upcomingTableBody.innerHTML = "";


        data.forEach(expense => {
          const row = document.createElement("tr");
          row.dataset.id = expense.ExpenseID; // ✅ Necessary for edit/delete
          row.innerHTML = getRowHTML(formatDate(expense.Date), expense.Title, expense.Category, "", expense.Amount, false);
          expenseTableBody.appendChild(row);
          
          renderDonutChart(); 
          attachRowListeners(row, false);
        });
      }).catch(err => console.error("Error loading expenses: ", err));

    fetch(`http://localhost:5000/api/expenses/upcoming/${userId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        data.forEach(expense => {
          const row = document.createElement("tr");
          row.dataset.id = expense.ExpenseID; // ✅ Necessary for edit/delete
          row.innerHTML = getRowHTML(formatDate(expense.Date), expense.Title, expense.Category, expense.Frequency, expense.Amount, true);
          upcomingTableBody.appendChild(row);
          
          renderDonutChart();
          attachRowListeners(row, true);
        });
      }).catch(err => console.error("Error loading upcoming expenses: ", err));

    
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");
  const logoutModal = document.getElementById("logout-modal");
  const confirmLogout = document.getElementById("confirm-logout");
  const cancelLogout = document.getElementById("cancel-logout");

  logoutBtn.addEventListener("click", () => {
    logoutModal.classList.remove("hidden");
  });

  confirmLogout.addEventListener("click", () => {
    // Call logout endpoint to clear session
    fetch("http://localhost:5000/api/user/logout", {
      method: "GET",
      credentials: 'include'
    })
      .then(() => {
        // Clear any local storage
        localStorage.clear();
        // Redirect to landing page
        window.location.href = "landingPage.html";
      })
      .catch((err) => {
        console.error("Error during logout:", err);
        // Still redirect even if logout fails
        localStorage.clear();
        window.location.href = "landingPage.html";
      });
  });

  cancelLogout.addEventListener("click", () => {
    logoutModal.classList.add("hidden");
  });

  // Footer logout button
  const footerLogoutBtn = document.querySelector(".footer-btn");
  if (footerLogoutBtn) {
    footerLogoutBtn.addEventListener("click", () => {
      logoutModal.classList.remove("hidden");
    });
  }
});