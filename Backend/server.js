require('dotenv').config(); // ⬅️ Add this at the very top

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_NAME:", process.env.DB_NAME);
const express = require('express'); // Ensure express is required if not already in app.js
const cors = require('cors'); // Add this line to import cors

const app = require('./app');

app.use(cors());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
