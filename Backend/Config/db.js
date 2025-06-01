require('dotenv').config({});
console.log("DB_SERVER from env:", process.env.DB_SERVER); 
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,          // e.g., brokedeveloper
  password: process.env.DB_PASS,      // e.g., StrongPass123
  server: process.env.DB_SERVER,      // 'localhost' or 'localhost\\SQLEXPRESS'
  database: process.env.DB_NAME,      // expense_tracker
  options: {
    encrypt: false,                   // true only for Azure
    trustServerCertificate: true      // allows self-signed certs (for dev)
  }
};

let poolPromise;

try {
  const pool = new sql.ConnectionPool(config);
  poolPromise = pool.connect();
  poolPromise.then(() => console.log('Connected to SQL Server'));
} catch (err) {
  console.error('Initial DB connection failed:', err);
}

module.exports = {
  sql,
  poolPromise
};