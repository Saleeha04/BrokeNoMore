
const { sql, poolPromise } = require('../Config/db');

const createUser = async (username, email, hashedPassword) => {
  const pool = await poolPromise;
  return pool.request()
    .input('username', sql.VarChar, username)
    .input('email', sql.VarChar, email)
    .input('password', sql.VarChar, hashedPassword)
    .query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (@username, @email, @password)');
};

const getUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT UserID as id, Username as username, Email as email, PasswordHash FROM Users WHERE Email = @email');
  return result.recordset[0];
};

const getUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT UserID as id, Username as username, Email as email FROM Users WHERE UserID = @id');
  return result.recordset[0];
};


module.exports = { createUser, getUserByEmail, getUserById };
