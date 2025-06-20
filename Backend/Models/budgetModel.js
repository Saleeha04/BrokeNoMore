const { poolPromise, sql } = require('../Config/db');

const createBudgetGoal = async (userId, month, amount) => {
    const pool = await poolPromise;
    return pool.request()
    .input('userId', sql.Int, userId)
    .input('month', sql.Date, month)
    .input('amount', sql.Decimal(10,2), amount)
    .query('INSERT INTO BudgetGoals (UserID, Month, Amount) VALUES (@userId, @month, @amount)');

};

const updateBudgetGoal = async (userId, month, newAmount) => {
    const pool = await poolPromise;
    return pool.request()
    .input('userId', sql.Int, userId)
    .input('month', sql.Date, month)
    .input('newAmount', sql.Decimal(10,2), newAmount)
    .query(`UPDATE BudgetGoals
        SET Amount = @newAmount, EditCount = EditCount + 1
        WHERE UserID = @userId AND Month = @month`);
};

const getBudgetGoal = async (userId, month) => {
    const pool = await poolPromise;
    return pool.request()
    .input('userId', sql.Int, userId)
    .input('month', sql.Date, month)
    .query('SELECT * FROM BudgetGoals WHERE UserID = @userId AND Month = @month');

};

module.exports = {
    createBudgetGoal,
    updateBudgetGoal,
    getBudgetGoal
};