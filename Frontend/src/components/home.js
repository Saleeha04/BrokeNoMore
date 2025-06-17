// import { renderDonutChart } from './chart-help.js';

let donutChart = null;

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
  const plusBtn = document.querySelector(".plus-btn");
  const modal = document.getElementById("entry-modal");
  const closeBtn = document.querySelector(".close-btn");
  const expenseForm = document.getElementById("expense-form");
  const expenseTableBody = document.querySelector(".expense-table");
  const upcomingTableBody = document.querySelector(".upcoming-table");

  const filterBtn = document.getElementById("filter-btn");
  const filterInput = document.getElementById("filter-input");

  const recurringCheckbox = document.getElementById("recurring-checkbox");
  const recurringDetails = document.getElementById("recurring-details");

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

  recurringCheckbox.addEventListener("change", () => {
    recurringDetails.style.display = recurringCheckbox.checked ? "block" : "none";
  });

  plusBtn.addEventListener("click", () => {
    rowBeingEdited = null;
    editingUpcoming = false;
    modal.classList.remove("hidden");
  });


  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = expenseForm.title.value;
    const date = expenseForm.date.value;
    const category = expenseForm.category.value;
    const amount = expenseForm.amount.value;
    const isRecurring = recurringCheckbox.checked;
    const rate = rateSelect.value || "-";
    const isUpcoming = isRecurring;

    const newRow = document.createElement("tr");

    // BACKEND SHENINANGINS

    const userId = 2; // 🔑 Replace with the logged-in user's ID if you have it
    const payload = {
      userId,
      title,
      date,
      category,
      amount,
      isRecurring,
      rate
    };

    fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Server response:", data);
      })
      .catch(err => {
        console.error("Error sending expense data:", err);
      });

      // BACKEND SHENINAGINS

    newRow.innerHTML = getRowHTML(date, title, category, rate, amount, isUpcoming);

    if (rowBeingEdited) {
      rowBeingEdited.remove(); // 🔄 remove old row to handle switch between tables
    }

    (isUpcoming ? upcomingTableBody : expenseTableBody).appendChild(newRow);
    attachRowListeners(newRow, isUpcoming);
    closeModal();
    renderDonutChart();
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
      row.remove();
      renderDonutChart();
    });

    editBtn.addEventListener("click", () => {
      rowBeingEdited = row;
      editingUpcoming = isUpcoming;

      const cells = row.querySelectorAll("td");
      expenseForm.date.value = cells[0].textContent;
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
        const cells = row.querySelectorAll("td");

        const paidRow = document.createElement("tr");
        paidRow.innerHTML = `
        <td>${cells[0].textContent}</td>
        <td>${cells[1].textContent}</td>
        <td>${cells[2].textContent}</td>
        <td>${cells[4].textContent}</td>
        <td>
          <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
          <button class="edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
        </td>
      `;

        expenseTableBody.appendChild(paidRow);
        row.remove();
        attachRowListeners(paidRow, false);
        renderDonutChart();
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
    const rows = Array.from(expenseTableBody.querySelectorAll("tr")).slice(1); // skip header row

    rows.forEach(row => {
      const categoryCell = row.querySelector("td:nth-child(3)");
      const categoryText = categoryCell?.textContent?.toLowerCase() || "";

      row.style.display = categoryText.includes(query) ? "" : "none";
    });
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
    window.location.href = "landingPage.html";
  });

  cancelLogout.addEventListener("click", () => {
    logoutModal.classList.add("hidden");
  });
});