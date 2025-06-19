const { NVarChar, VarChar, Int } = require('mssql');
const { sql, poolPromise } = require('../Config/db');

const createUser = async (username, hashedPassword, question, answer) => {
  const pool = await poolPromise;
  return pool.request()
    .input('username', VarChar, username)
    .input('password', VarChar, hashedPassword)
    .input('question', NVarChar, question)
    .input('answer', NVarChar, answer)
    .query(`
      INSERT INTO Users (Username, PasswordHash, SecurityQuestion, SecurityAnswer)
      VALUES (@username, @password, @question, @answer)
    `);
};

const getUserByUsername = async (username) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('username', VarChar, username)
    .query('SELECT UserID as id, Username as username, PasswordHash FROM Users WHERE Username = @username');
  return result.recordset[0];
};

const getUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', Int, id)
    .query('SELECT UserID as id, Username as username FROM Users WHERE UserID = @id'); // ⚠️ Removed email
  return result.recordset[0];
};

const updateProfilePicture = async (userId, profilePictureData) => {
  const pool = await poolPromise;
  return pool.request()
    .input('userId', Int, userId)
    .input('profilePicture', NVarChar, profilePictureData)
    .query('UPDATE Users SET ProfilePicture = @profilePicture WHERE UserID = @userId');
};

const getProfilePicture = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', Int, userId)
    .query('SELECT ProfilePicture FROM Users WHERE UserID = @userId');
  return result.recordset[0]?.ProfilePicture || null;
};

const saveIncomeAndGoal = async (userId, incomeAmount, goalAmount) => {
  const pool = await poolPromise;
  const month = new Date().toISOString().slice(0, 7) + "-01";

  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    await transaction.request()
      .input('userId', sql.Int, userId)
      .input('amount', sql.Decimal(10, 2), incomeAmount)
      .input('month', sql.Date, month)
      .query(`
        MERGE Income AS target
        USING (SELECT @userId AS UserID, @month AS MonthI) AS source
        ON target.UserID = source.UserID AND target.MonthI = source.MonthI
        WHEN MATCHED THEN
          UPDATE SET Amount = @amount
        WHEN NOT MATCHED THEN
          INSERT (UserID, Amount, MonthI) VALUES (@userId, @amount, @month);
      `);

    await transaction.request()
      .input('userId', sql.Int, userId)
      .input('amount', sql.Decimal(10, 2), goalAmount)
      .input('month', sql.Date, month)
      .query(`
        MERGE BudgetGoals AS target
        USING (SELECT @userId AS UserID, @month AS Month) AS source
        ON target.UserID = source.UserID AND target.Month = source.Month
        WHEN MATCHED THEN
          UPDATE SET Amount = @amount, EditCount = EditCount + 1
        WHEN NOT MATCHED THEN
          INSERT (UserID, Month, Amount) VALUES (@userId, @month, @amount);
      `);

    await transaction.commit();
    return true;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  updateProfilePicture,
  getProfilePicture,
  saveIncomeAndGoal
};
