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

// Function to get a random tip
function getRandomTip() {
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

// Function to display the tip
function displayTip() {
  const tipElement = document.getElementById('tip-text');
  if (tipElement) {
    tipElement.textContent = getRandomTip();

    // Change tip every 15 seconds (15000 milliseconds)
    setInterval(() => {
      tipElement.textContent = getRandomTip();
    }, 15000);
  }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', displayTip);

const recurringCheckbox = document.getElementById('recurring-checkbox');
const recurringDetails = document.getElementById('recurring-details');
const rateSelect = document.getElementById('rate');

recurringCheckbox.addEventListener('change', () => {
  if (recurringCheckbox.checked) {
    recurringDetails.style.display = 'block';
    rateSelect.setAttribute('required', 'true');
  } else {
    recurringDetails.style.display = 'none';
    rateSelect.removeAttribute('required');
  }
});

// Modal wrapper logic
document.addEventListener('DOMContentLoaded', function () {
  const plusButton = document.querySelector('.plus-btn');
  const modal = document.getElementById('entry-modal');
  const modalTitle = document.getElementById('modal-title');
  const expenseForm = document.getElementById('expense-form');
  const closeBtn = document.querySelector('.close-btn');

  const recurringCheckbox = document.getElementById('recurring-checkbox');
  const recurringDetails = document.getElementById('recurring-details');
  const categoryInput = document.getElementById('category');

  const expenseTable = document.querySelector('.table-box table');

  plusButton.addEventListener('click', function () {
    modalTitle.textContent = 'Add Expense';
    modal.classList.remove('hidden');
    expenseForm.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', function () {
    closeModal();
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  if (recurringCheckbox) {
    recurringCheckbox.addEventListener('change', function () {
      if (this.checked) {
        recurringDetails.style.display = 'block';
      } else {
        recurringDetails.style.display = 'none';
      }
    });
  }

  if (categoryInput) {
    categoryInput.addEventListener('click', function () {
      const newCategory = prompt('Enter or select a category:');
      if (newCategory) {
        this.value = newCategory;
      }
    });
  }

  expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    console.log(expenseForm)
    const title = expenseForm.querySelector('input[name="title"]').value;
    const date = expenseForm.querySelector('input[name="date"]').value;
    const category = expenseForm.querySelector('input[name="category"]').value;
    const amount = expenseForm.querySelector('input[name="amount"]').value;
    const isRecurring = document.getElementById('recurring-checkbox').checked; // ✅ fixed
    const reoccurrenceRate = document.getElementById('rate')?.value || '-';
    const reminder = document.getElementById('reminder-checkbox')?.checked;

    if (isRecurring) {
      const upcomingTable = document.querySelector('.upcoming-table');
      const newRow = upcomingTable.insertRow(-1);
      newRow.innerHTML = `
      <td>${date}</td>
      <td>${title}</td>
      <td>${category}</td>
      <td>${reoccurrenceRate}</td>
      <td>$${amount}</td>
      <td>–</td>
    `;
    } else {
      const expenseTable = document.querySelector('.expense-table');
      const newRow = expenseTable.insertRow(-1);
      newRow.innerHTML = `
      <td>${date}</td>
      <td>${title}</td>
      <td>${category}</td>
      <td>$${amount}</td>
      <td>–</td>
    `;
    }
    console.log("Recurring checked:", isRecurring);

    closeModal();
  });

  const categorySelect = document.getElementById('category-select');
  const newCategoryInput = document.getElementById('new-category-input');

  // Initialize with default or saved categories
  let savedCategories = JSON.parse(localStorage.getItem('categories')) || [];

  // Populate the dropdown
  function populateCategoryDropdown() {
    categorySelect.innerHTML = "";

    savedCategories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });

    const createNewOption = document.createElement('option');
    createNewOption.value = "create-new";
    createNewOption.textContent = "Create new category";
    categorySelect.appendChild(createNewOption);
  }

  // Handle category selection
  categorySelect.addEventListener('change', () => {
    if (categorySelect.value === 'create-new') {
      newCategoryInput.style.display = 'block';
      newCategoryInput.setAttribute('required', 'true');
    } else {
      newCategoryInput.style.display = 'none';
      newCategoryInput.removeAttribute('required');
    }
  });

  // On form submit: handle new category
  document.getElementById('expense-form').addEventListener('submit', (e) => {
    const selected = categorySelect.value;

    if (selected === 'create-new') {
      const newCategory = newCategoryInput.value.trim();
      if (newCategory && !savedCategories.includes(newCategory)) {
        savedCategories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(savedCategories));
      }

      // Set the input value so the form submits it correctly
      categorySelect.value = newCategory;
      newCategoryInput.style.display = 'none';
    }
  });

  // Populate on load
  populateCategoryDropdown();


  function closeModal() {
    modal.classList.add('hidden');
    expenseForm.reset();
    if (recurringDetails) recurringDetails.style.display = 'none';
  }
});
