import Chart from 'chart.js/auto';

let donutChartInstance = null;

export function renderDonutChart() {
  const expenseTableBody = document.querySelector('.expense-table tbody');
  const categoryTotals = {};

  // Gather totals by category
  expenseTableBody.querySelectorAll('tr').forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const category = cells[2].textContent.trim();
      const amount = parseFloat(cells[3].textContent.trim());
      if (!isNaN(amount)) {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800', '#9C27B0', '#00BCD4', '#E91E63'];

  const ctx = document.getElementById('donutChart').getContext('2d');

  // Destroy previous chart instance if it exists
  if (donutChartInstance) {
    donutChartInstance.destroy();
  }

  // Create new chart
  donutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses by Category',
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        delay: 500,
        duration: 1000
      },
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Expenses by Category'
        }
      }
    }
  });
}
