require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Explicitly allow all methods
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api', budgetRoutes);
app.use('/api', alertRoutes);
app.use('/api', summaryRoutes);

app.get('/', (req, res) => {
  res.send('BrokeNoMore backend is up and running~');
});

// Serve static files (adjust path to your HTML files)
app.use(express.static('Frontend')); // Replace 'Frontend' with the folder containing signup.html

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});