const { poolPromise, sql } = require('../Config/db');

const createMonthlySummary = async (userId, month, totalIncome, totalExpense) => {
    const pool = await poolPromse;
    return pool.request()
    .input('userId', sql.Int, userId)
    .input('month', sql.Date, month)
    .input('totalIncome', sql.Decimal(10,2), totalIncome)
    .input('totalExpense', sql.Decimal(10,2), totalExpense)
    .query(`
        INSERT INTO FinancialSummaries (UserID, Month, TotalIncome, TotalExpense)
        VALUES (@userId, @month, @totalIncome, @totalExpense) `);
};

const getMonthlySummary = async (userId, month) => {
    const pool = await poolPromise;
    return pool.request()
    .input('userId', sql.Int, userId)
    .input('month', sql.Date, month)
    .query(`
        SELECT * FROM FinancialSummaries
        WHERE UserID = @userId AND Month = @month`);
};

module.exports = {
    createMonthlySummary,
    getMonthlySummary
};