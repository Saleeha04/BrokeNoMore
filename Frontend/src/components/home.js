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

document.addEventListener('DOMContentLoaded', function() {

  const plusButtons = document.querySelectorAll('.plus-btn');
  const modal = document.getElementById('entry-modal');
  const modalTitle = document.getElementById('modal-title');
  const expenseForm = document.getElementById('expense-form');
  const incomeForm = document.getElementById('income-form');
  const closeBtn = document.querySelector('.close-btn');

  let currentTable = null;
  let currentType = '';

  plusButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tableBox = this.closest('.table-box');
      const table = tableBox.querySelector('table');
      currentTable = table;

      if (tableBox.querySelector('h2').textContent.includes('Expenses')) {
        openModal('Expense');
      } else if (tableBox.querySelector('h2').textContent.includes('Income')) {
        openModal('Income');
      }
    });
  });

  function openModal(type) {
    currentType = type;
    modalTitle.textContent = `Add ${type}`;
    if (type === 'Expense') {
      expenseForm.classList.remove('hidden');
      incomeForm.classList.add('hidden');
    } else {
      incomeForm.classList.remove('hidden');
      expenseForm.classList.add('hidden');
    }
    modal.classList.remove('hidden');
  }

  closeBtn.addEventListener('click', function() {
    closeModal();
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = expenseForm.querySelector('input[name="date"]').value;
    const expense = expenseForm.querySelector('input[name="expense"]').value;
    const category = expenseForm.querySelector('input[name="category"]').value;
    const amount = expenseForm.querySelector('input[name="amount"]').value;

    const newRow = currentTable.insertRow(-1);
    newRow.innerHTML = `
      <td>${date}</td>
      <td>${expense}</td>
      <td>${category}</td>
      <td>$${amount}</td>
    `;

    closeModal();
  });

  incomeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = incomeForm.querySelector('input[name="date"]').value;
    const income = incomeForm.querySelector('input[name="income"]').value;
    const amount = incomeForm.querySelector('input[name="amount"]').value;

    const newRow = currentTable.insertRow(-1);
    newRow.innerHTML = `
      <td>${date}</td>
      <td>${income}</td>
      <td>$${amount}</td>
    `;

    closeModal();
  });

  function closeModal() {
    modal.classList.add('hidden');
    expenseForm.reset();
    incomeForm.reset();
  }

});
