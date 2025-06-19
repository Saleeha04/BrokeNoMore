const { NVarChar, VarChar, Int } = require('mssql');
const { sql, poolPromise } = require('../Config/db');

const createUser = async (username, hashedPassword, question, answer) => {
  const pool = await poolPromise;
  return pool.request()
    .input('username', VarChar, username)
    .input('password', VarChar, hashedPassword)
    .input('question', NVarChar, question)
    .input('answer', NVarChar, answer)
    .query(`INSERT INTO Users (Username, PasswordHash, SecurityQuestion, SecurityAnswer)
      VALUES (@username, @password, @question, @answer)`);
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
    .query('SELECT UserID as id, Username as username, Email as email FROM Users WHERE UserID = @id');
  return result.recordset[0];
};

module.exports = { createUser, getUserByUsername, getUserById }; // Add getUserByUsername here