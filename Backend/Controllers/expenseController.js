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

// Last Updated by Saleeha :D       -- Edit krdena isse if you change anything (so i know who to blame)
const addExpense = async (req, res) => {
  console.log("▶️ Request body:", req.body);

  const { userId, title, date, category, amount, isRecurring, rate } = req.body;

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

    if (!expenseResult.recordset || !expenseResult.recordset[0]) {
      throw new Error("Expense insert failed, no record returned. SQL result: " + JSON.stringify(expenseResult));
    }
    const expenseId = expenseResult.recordset[0].ExpenseID;

    if (isRecurring && rate && rate !== "-") {
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
    console.error("❌ Error saving expense:", err);
    res.status(500).json({ message: 'Error saving expense...', error: err.message, details: err });
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

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // First delete from RecurringExpenses (if exists)
    await pool.request()
      .input('expenseId', sql.Int, id)
      .query('DELETE FROM RecurringExpenses WHERE ExpenseID = @expenseId');

    // Then delete from Expenses
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Expenses WHERE ExpenseID = @id');

    // Check if any row was deleted
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting expense:', err);
    res.status(500).json({ message: 'Error deleting expense', error: err.message });
  }
};


const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, date, category, isRecurring, rate } = req.body;

  try {
    const pool = await poolPromise;

    // ✅ Update the expense
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(200), title)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('date', sql.DateTime, date)
      .input('category', sql.VarChar(50), category)
      .input('isRecurring', sql.Bit, isRecurring)
      .query(`
        UPDATE Expenses
        SET Title = @title,
            Amount = @amount,
            Date = @date,
            Category = @category,
            IsRecurring = @isRecurring
        WHERE ExpenseID = @id
      `);

    // ✅ If no longer recurring, remove from RecurringExpenses
    if (!isRecurring) {
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM RecurringExpenses WHERE ExpenseID = @id');
    }

    // ✅ If still recurring or newly marked as recurring
    if (isRecurring) {
      const frequency = rate || 'Monthly'; // default to Monthly if rate missing
      const nextDate = new Date(date);
      nextDate.setMonth(nextDate.getMonth() + 1); // crude "next" date

      // Check if already exists
      const check = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM RecurringExpenses WHERE ExpenseID = @id');

      if (check.recordset.length > 0) {
        // Update existing
        await pool.request()
          .input('id', sql.Int, id)
          .input('nextDueDate', sql.Date, nextDate)
          .input('frequency', sql.VarChar(20), frequency)
          .query(`
            UPDATE RecurringExpenses
            SET NextDueDate = @nextDueDate,
                Frequency = @frequency
            WHERE ExpenseID = @id
          `);
      } else {
        // Insert new
        await pool.request()
          .input('id', sql.Int, id)
          .input('nextDueDate', sql.Date, nextDate)
          .input('frequency', sql.VarChar(20), frequency)
          .query(`
            INSERT INTO RecurringExpenses (ExpenseID, NextDueDate, Frequency)
            VALUES (@id, @nextDueDate, @frequency)
          `);
      }
    }

    res.status(200).json({ message: 'Expense updated successfully.' });
  } catch (err) {
    console.error('❌ Error updating expense:', err);
    res.status(500).json({ message: 'Error updating expense', error: err.message });
  }
};

const getExpenses = async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Expenses WHERE UserID = @userId AND IsRecurring = 0');

    console.log('Fetched expenses:', result.recordset);

    res.status(200).json(result.recordset); // ✅ Must always respond
  } catch (err) {
    console.error('❌ Error in getExpenses:', err);
    res.status(500).json({ message: 'Error retrieving expenses', error: err.message });
  }
};

const getUpcomingExpenses = async (req, res) => {
  const { userId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT e.ExpenseID, e.Title, e.Amount, e.Date, e.Category, r.Frequency
        FROM Expenses e
        JOIN RecurringExpenses r ON e.ExpenseID = r.ExpenseID
        WHERE e.UserID = @userId`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching upcoming expenses:", err);
    res.status(500).json({ message: "Error retrieving upcoming expenses", error: err.message });
  }
};

const markExpenseAsPaid = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    // 1. Update the existing expense
    await pool.request()
      .input('id', sql.Int, id)
      .input('date', sql.DateTime, new Date()) // mark today as paid date
      .query(`
        UPDATE Expenses
        SET IsRecurring = 0,
            Date = @date
        WHERE ExpenseID = @id
      `);

    // 2. Delete it from RecurringExpenses
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM RecurringExpenses WHERE ExpenseID = @id');

    res.status(200).json({ message: 'Expense marked as paid successfully.' });
  } catch (err) {
    console.error('❌ Error marking expense as paid:', err);
    res.status(500).json({ message: 'Error marking as paid', error: err.message });
  }
};





// POST /expenses - Create a new expense
const createExpense = async (req, res) => {
  const { userId, title, amount, date, isRecurring, category, rate } = req.body;

  if (!userId || !title || !amount || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await poolPromise;

    // Insert into Expenses table
    const expenseResult = await pool.request()
      .input("userId", sql.Int, userId)
      .input("title", sql.VarChar, title)
      .input("amount", sql.Decimal(10, 2), amount)
      .input("date", sql.DateTime, date)
      .input("isRecurring", sql.Bit, isRecurring)
      .input("category", sql.VarChar, category || "")
      .query(`
        INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
        OUTPUT INSERTED.ExpenseID
        VALUES (@userId, @title, @amount, @date, @isRecurring, @category)
      `);

    const expenseId = expenseResult.recordset[0].ExpenseID;

    console.log("✅ Expense inserted with ID:", expenseId);

    // ✅ If it's recurring and not a "once" type
    if (isRecurring && rate && rate.toLowerCase() !== "once") {
      const nextDueDate = new Date(date);

      // Calculate next date based on frequency
      if (rate === "weekly") nextDueDate.setDate(nextDueDate.getDate() + 7);
      else if (rate === "monthly") nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      else if (rate === "annually") nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

      await pool.request()
        .input("expenseId", sql.Int, expenseId)
        .input("nextDueDate", sql.Date, nextDueDate)
        .input("frequency", sql.VarChar, rate)
        .query(`
          INSERT INTO RecurringExpenses (ExpenseID, NextDueDate, Frequency)
          VALUES (@expenseId, @nextDueDate, @frequency)
        `);

      console.log("📌 Recurring expense recorded:", { expenseId, nextDueDate, rate });
    } else {
      console.log("📌 Non-recurring or once-only expense, skipping recurring logic.");
    }

    res.status(201).json({ message: "Expense created successfully", expenseId });
  } catch (err) {
    console.error("❌ Error creating expense:", err);
    res.status(500).json({ message: "Error creating expense", error: err.message });
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
// const updateExpense = async (req, res) => {
//   try {
//     const expenseId = parseInt(req.params.expenseId);
//     if (!expenseId) return res.status(400).json({ message: 'Invalid expense ID' });

//     const { title, amount, date, isRecurring, category } = req.body;

//     await updateExpenseDB(expenseId, { title, amount, date, isRecurring, category });

//     res.json({ message: 'Expense updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating expense', error: err.message });
//   }
// };

// DELETE /expenses/:expenseId - Delete expense by ID
// const deleteExpense = async (req, res) => {
//   try {
//     const expenseId = parseInt(req.params.expenseId);
//     if (!expenseId) return res.status(400).json({ message: 'Invalid expense ID' });

//     await deleteExpenseDB(expenseId);

//     res.json({ message: 'Expense deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting expense', error: err.message });
//   }
// };

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
  getUpcomingExpenses, // NEW
  getExpenses, // NEW
  markExpenseAsPaid, // NEW
  createExpense,
  getExpensesFiltered,
  getExpensesByUser,
  updateExpense, // NEW
  deleteExpense, // NEW
  generateRecurringExpenses, // Optional export for periodic job
};