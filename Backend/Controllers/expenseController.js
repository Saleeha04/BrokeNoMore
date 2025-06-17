const { poolPromise, sql } = require('../Config/db');

const {
  createExpenseDB,
  getExpensesByUserDB,
  updateExpenseDB,
  deleteExpenseDB,
  getRecurringExpensesDB,
  createRecurringExpenseDB,
  updateNextDueDateDB,
} = require('../Models/expenseModel');

// Last Updated by Saleeha :D       -- Edit krdena isse if you change anything
const addExpense = async (req, res) => {
  console.log("▶️ Request body:", req.body);

  const { userId, title, date, category, amount, isRecurring, Rate } = req.body;

  try {
    const pool = await poolPromise;

    const expenseResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('title', sql.NVarChar, title)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('date', sql.Date, date)
      .input('isRecurring', sql.Bit, isRecurring ? 1 : 0)
      .input('category', sql.NVarChar, category)
      .query(`INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
        OUTPUT INSERTED.ExpenseID
        VALUES (@userId, @title, @amount, @date, @isRecurring, @category)`);

    const expenseId = expenseResult.recordSet[0].ExpenseID;

    // Insert into RecurringExpenses only if rate is not 'once'
    if (isRecurring) {
      const nextDueDate = calculateNextDate(date, rate);
      await pool.request()
        .input('expenseId', sql.Int, expenseId)
        .input('nextDueDate', sql.Date, nextDueDate)
        .input('frequency', sql.NVarChar, rate)
        .query(`INSERT INTO RecurringExpenses (ExpenseID, NextDueDate, Frequency)
            VALUES (@expenseId, @nextDueDate, @frequency)`);
    }



    res.status(201).json({ message: 'Expenses saved Successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error saving expense...', error: err.message });
  }
};

function calculateNextDate(currentDate, frequency) {
  const date = new Date(currentDate);
  switch (frequency.toLowerCase()) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'annually':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'once':
    default:
      return new Date(currentDate).toISOString().split('T')[0]; // keep the original date
  }
  return date.toISOString().split('T')[0];
}








// POST /expenses - Create a new expense
const createExpense = async (req, res) => {
  try {
    const { userId, title, amount, date, isRecurring, category } = req.body;

    // Validate required fields
    if (!userId || !title || !amount || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the expense in DB
    const expenseId = await createExpenseDB({
      userId,
      title,
      amount,
      date,
      isRecurring: isRecurring || false,
      category,
    });

    // If recurring, create entry in RecurringExpenses
    if (isRecurring) {
      // NextDueDate: next month from the given date
      const nextDueDate = new Date(date);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      await createRecurringExpenseDB({
        expenseId,
        nextDueDate,
        frequency: 'Monthly',
      });
    }

    res.status(201).json({ message: 'Expense created successfully', expenseId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating expense', error: err.message });
  }
};



// GET /expenses/:userId/filter - Get filtered expenses for a user by month and/or category
const getExpensesFiltered = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: 'Invalid userId' });

    const { month, category } = req.query;

    // Call the DB function for filtered expenses
    // Assuming getExpensesByUserDB supports filtering with month and category
    const expenses = await getExpensesByUserDB(userId, month, category);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching filtered expenses', error: err.message });
  }
};

// GET /expenses/:userId - Get all expenses for user, with optional filtering by month or category
const getExpensesByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) return res.status(400).json({ message: 'Invalid userId' });

    // Optional query params for filtering (month, category)
    const { month, category } = req.query;

    const expenses = await getExpensesByUserDB(userId, month, category);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err.message });
  }
};

// PUT /expenses/:expenseId - Update expense by ID
const updateExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);
    if (!expenseId) return res.status(400).json({ message: 'Invalid expense ID' });

    const { title, amount, date, isRecurring, category } = req.body;

    await updateExpenseDB(expenseId, { title, amount, date, isRecurring, category });

    res.json({ message: 'Expense updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating expense', error: err.message });
  }
};

// DELETE /expenses/:expenseId - Delete expense by ID
const deleteExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);
    if (!expenseId) return res.status(400).json({ message: 'Invalid expense ID' });

    await deleteExpenseDB(expenseId);

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense', error: err.message });
  }
};

// BONUS: Function to auto-generate recurring entries monthly (run by a cron job or manual call)
const generateRecurringExpenses = async () => {
  try {
    const recurringExpenses = await getRecurringExpensesDB();

    for (const recExp of recurringExpenses) {
      const today = new Date();
      const nextDueDate = new Date(recExp.NextDueDate);

      if (nextDueDate <= today) {
        // Create new expense for this recurring expense
        await createExpenseDB({
          userId: recExp.UserID,
          title: recExp.Title,
          amount: recExp.Amount,
          date: nextDueDate,
          isRecurring: true,
          category: recExp.Category,
        });

        // Calculate next due date based on frequency (assuming monthly)
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        // Update next due date in RecurringExpenses table
        await updateNextDueDateDB(recExp.RecurringID, nextDueDate);
      }
    }
  } catch (err) {
    console.error('Error generating recurring expenses:', err);
  }
};

module.exports = {
  addExpense, // NEW 
  createExpense,
  getExpensesFiltered,
  getExpensesByUser,
  updateExpense,
  deleteExpense,
  generateRecurringExpenses, // Optional export for periodic job
};