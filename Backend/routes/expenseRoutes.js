const express = require('express');
const router = express.Router();

const {
  createExpense,
  getExpensesByUser,
  updateExpense,
  deleteExpense,
  getExpensesFiltered,
} = require('../Controllers/expenseController');

//  Create a new expense
router.post('/', createExpense);

// Get filtered expenses for a user (e.g., by month or category)

router.get('/:userId/filter', getExpensesFiltered);

//  Get all expenses for a specific user
router.get('/:userId', getExpensesByUser);

//  Update an expense by its ID
router.put('/:expenseId', updateExpense);

//  Delete an expense by its ID
router.delete('/:expenseId', deleteExpense);

module.exports = router;