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