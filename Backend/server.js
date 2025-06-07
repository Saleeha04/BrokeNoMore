require('dotenv').config(); // ⬅️ Add this at the very top

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_NAME:", process.env.DB_NAME);

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
