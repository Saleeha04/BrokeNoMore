import { renderDonutChart } from './charts.js';

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
  recurringCheckbox.addEventListener('change', () => {
    if (recurringCheckbox.checked) {
      recurringDetails.style.display = 'block';
      rateSelect.setAttribute('required', 'true');
    } else {
      recurringDetails.style.display = 'none';
      rateSelect.removeAttribute('required');
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

  // Toggle recurring fields
  recurringCheckbox.addEventListener("change", () => {
    recurringDetails.style.display = recurringCheckbox.checked ? "block" : "none";
  });

  // Show modal to add new entry
  plusBtn.addEventListener("click", () => {
    rowBeingEdited = null;
    editingUpcoming = false;
    modal.classList.remove("hidden");
  });

  // Close modal
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Handle form submission
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = expenseForm.title.value;
    const date = expenseForm.date.value;
    const category = expenseForm.category.value;
    const amount = expenseForm.amount.value;
    const isRecurring = recurringCheckbox.checked;
    const rate = document.getElementById("rate").value || "-";

    const isUpcoming = isRecurring;

    if (rowBeingEdited) {
      // Edit existing row
      if (editingUpcoming) {
        rowBeingEdited.innerHTML = `
          <td>${date}</td>
          <td>${title}</td>
          <td>${category}</td>
          <td>${rate}</td>
          <td>${amount}</td>
          <td><button class="delete-btn">X</button><button class="edit-btn">T</button></td>
        `;
        attachRowListeners(rowBeingEdited, true);
      } else {
        rowBeingEdited.innerHTML = `
          <td>${date}</td>
          <td>${title}</td>
          <td>${category}</td>
          <td>${amount}</td>
          <td><button class="delete-btn">X</button><button class="edit-btn">T</button></td>
        `;
        attachRowListeners(rowBeingEdited, false);
      }

      rowBeingEdited = null;
      editingUpcoming = false;
    } else {
      // New entry
      const newRow = document.createElement("tr");

      if (isUpcoming) {
        newRow.innerHTML = `
          <td>${date}</td>
          <td>${title}</td>
          <td>${category}</td>
          <td>${rate}</td>
          <td>${amount}</td>
<td>
    <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
    <button class="edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
  </td>        `;
        upcomingTableBody.appendChild(newRow);
        attachRowListeners(newRow, true);
      } else {
        newRow.innerHTML = `
          <td>${date}</td>
          <td>${title}</td>
          <td>${category}</td>
          <td>${amount}</td>
          <td><button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            <button class="edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
          </td>
        `;
        expenseTableBody.appendChild(newRow);
        attachRowListeners(newRow, false);
      }
    }

    closeModal();
    renderDonutChart();
  });

  // Attach edit & delete handlers
  function attachRowListeners(row, isUpcoming) {
    const deleteBtn = row.querySelector(".delete-btn");
    const editBtn = row.querySelector(".edit-btn");

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
  }

  // Filter button toggle
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

  // Real-time filter
  filterInput.addEventListener("input", () => {
    const query = filterInput.value.trim().toLowerCase();
    filterExpenses(query);
  });

  function filterExpenses(query) {
    const rows = expenseTableBody.querySelectorAll("tbody tr");

    rows.forEach(row => {
      const categoryCell = row.cells[2]; // Category is in the 3rd column
      const categoryText = categoryCell?.textContent?.toLowerCase() || "";
      row.style.display = categoryText.includes(query) ? "" : "none";
    });
  }

  function closeModal() {
    modal.classList.add("hidden");
    expenseForm.reset();
    recurringDetails.style.display = "none";
    rowBeingEdited = null;
    editingUpcoming = false;
  }
});
