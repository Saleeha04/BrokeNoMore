const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');

const {
  addExpense,
  deleteExpense,
  updateExpense,
  getExpenses,
  getUpcomingExpenses,
  markExpenseAsPaid,
  
  createExpense,
  getExpensesByUser,
  getExpensesFiltered,
} = require('../Controllers/expenseController');

// Protect all routes with session-based auth
router.use(auth);

// CHANGES BY Saleeha ofc
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense);
router.get('/:userId', getExpenses);
router.get('/upcoming/:userId', getUpcomingExpenses);
router.post('/mark-paid/:id', markExpenseAsPaid);

//  Create a new expense
router.post('/', createExpense);

// Get filtered expenses for a user (e.g., by month or category)
router.get('/:userId/filter', getExpensesFiltered);

//  Get all expenses for a specific user
router.get('/:userId', getExpensesByUser);

module.exports = router;