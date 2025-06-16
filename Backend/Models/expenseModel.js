const { sql, poolPromise } = require('../Config/db');

// Create expense and return inserted ExpenseID
const createExpenseDB = async ({ userId, title, amount, date, isRecurring, category }) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('title', sql.VarChar, title)
    .input('amount', sql.Decimal(10, 2), amount)
    .input('date', sql.DateTime, date)
    .input('isRecurring', sql.Bit, isRecurring)
    .input('category', sql.VarChar, category || null)
    .query(`INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
            OUTPUT INSERTED.ExpenseID
            VALUES (@userId, @title, @amount, @date, @isRecurring, @category)`);

  return result.recordset[0].ExpenseID;
};

// Get expenses by userId with optional month (YYYY-MM) and category filtering
const getExpensesByUserDB = async (userId, month, category) => {
  const pool = await poolPromise;

  // Base query
  let query = `SELECT * FROM Expenses WHERE UserID = @userId`;
  if (month) {
    query += ` AND FORMAT(Date, 'yyyy-MM') = @month`;
  }
  if (category) {
    query += ` AND Category = @category`;
  }

  const request = pool.request().input('userId', sql.Int, userId);
  if (month) request.input('month', sql.VarChar, month);
  if (category) request.input('category', sql.VarChar, category);

  const result = await request.query(query);
  return result.recordset;
};

// Update expense by expenseId
const updateExpenseDB = async (expenseId, { title, amount, date, isRecurring, category }) => {
  const pool = await poolPromise;

  // Build dynamic update query and inputs
  let query = `UPDATE Expenses SET `;
  const updates = [];
  if (title !== undefined) updates.push(`Title = @title`);
  if (amount !== undefined) updates.push(`Amount = @amount`);
  if (date !== undefined) updates.push(`Date = @date`);
  if (isRecurring !== undefined) updates.push(`IsRecurring = @isRecurring`);
  if (category !== undefined) updates.push(`Category = @category`);

  query += updates.join(', ');
  query += ` WHERE ExpenseID = @expenseId`;

  const request = pool.request().input('expenseId', sql.Int, expenseId);

  if (title !== undefined) request.input('title', sql.VarChar, title);
  if (amount !== undefined) request.input('amount', sql.Decimal(10, 2), amount);
  if (date !== undefined) request.input('date', sql.DateTime, date);
  if (isRecurring !== undefined) request.input('isRecurring', sql.Bit, isRecurring);
  if (category !== undefined) request.input('category', sql.VarChar, category);

  await request.query(query);
};

// Delete expense by expenseId
const deleteExpenseDB = async (expenseId) => {
  const pool = await poolPromise;
  // First delete recurring entry if any
  await pool.request()
    .input('expenseId', sql.Int, expenseId)
    .query('DELETE FROM RecurringExpenses WHERE ExpenseID = @expenseId');

  // Then delete expense
  await pool.request()
    .input('expenseId', sql.Int, expenseId)
    .query('DELETE FROM Expenses WHERE ExpenseID = @expenseId');
};

// Get all recurring expenses with details joined from Expenses table
const getRecurringExpensesDB = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`SELECT r.RecurringID, r.ExpenseID, r.NextDueDate, r.Frequency,
                   e.UserID, e.Title, e.Amount, e.Category
            FROM RecurringExpenses r
            INNER JOIN Expenses e ON r.ExpenseID = e.ExpenseID`);
  return result.recordset;
};

// Create new entry in RecurringExpenses
const createRecurringExpenseDB = async ({ expenseId, nextDueDate, frequency }) => {
  const pool = await poolPromise;
  await pool.request()
    .input('expenseId', sql.Int, expenseId)
    .input('nextDueDate', sql.Date, nextDueDate)
    .input('frequency', sql.VarChar, frequency)
    .query(`INSERT INTO RecurringExpenses (ExpenseID, NextDueDate, Frequency)
            VALUES (@expenseId, @nextDueDate, @frequency)`);
};

// Update NextDueDate in RecurringExpenses
const updateNextDueDateDB = async (recurringId, nextDueDate) => {
  const pool = await poolPromise;
  await pool.request()
    .input('recurringId', sql.Int, recurringId)
    .input('nextDueDate', sql.Date, nextDueDate)
    .query(`UPDATE RecurringExpenses SET NextDueDate = @nextDueDate WHERE RecurringID = @recurringId`);
};

module.exports = {
  createExpenseDB,
  getExpensesByUserDB,
  updateExpenseDB,
  deleteExpenseDB,
  getRecurringExpensesDB,
  createRecurringExpenseDB,
  updateNextDueDateDB,
};
