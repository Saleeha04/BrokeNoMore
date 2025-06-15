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

// Modal logic
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
    const rate = document.getElementById("rate").value || "-";
    const isUpcoming = isRecurring;

    const newRow = document.createElement("tr");

    if (rowBeingEdited) {
      // Editing logic
      newRow.innerHTML = getRowHTML(date, title, category, rate, amount, isUpcoming);
      rowBeingEdited.replaceWith(newRow);
    } else {
      // New entry
      newRow.innerHTML = getRowHTML(date, title, category, rate, amount, isUpcoming);
      (isUpcoming ? upcomingTableBody : expenseTableBody).appendChild(newRow);
    }

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
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
        <button class="edit-btn"><i class="fas fa-pen"></i></button>
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
    row.querySelector(".delete-btn").addEventListener("click", () => {
      row.remove();
      renderDonutChart();
    });

    row.querySelector(".edit-btn").addEventListener("click", () => {
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
  }

function closeModal() {
  modal.classList.add("hidden");
  expenseForm.reset();
  recurringDetails.style.display = "none";
  rateSelect.removeAttribute('required'); // <-- this line is critical
  rowBeingEdited = null;
  editingUpcoming = false;
}

  filterBtn.addEventListener("click", () => {
    const isVisible = filterInput.style.display !== "none";
    filterInput.style.display = isVisible ? "none" : "inline-block";
    if (!isVisible) filterInput.focus();
    else {
      filterInput.value = '';
      filterExpenses('');
    }
  });

  filterInput.addEventListener("input", () => {
    filterExpenses(filterInput.value.trim().toLowerCase());
  });

  function filterExpenses(query) {
const rows = Array.from(expenseTableBody.querySelectorAll("tr")).slice(1);
    rows.forEach(row => {
      const categoryText = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
      row.style.display = categoryText.includes(query) ? "" : "none";
    });
  }

  renderDonutChart();
});
