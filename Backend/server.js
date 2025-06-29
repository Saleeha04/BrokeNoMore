require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const app = express();
const app = require('./app');

// // ✅ CORS Middleware — Must come before routes
app.use(cors({
  origin: ['http://127.0.0.1:5500',
        'http://127.0.0.1:5501',
        'http://127.0.0.1:5502'], // Allow Live Server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Other middleware
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
app.use('/api/user', userRoutes); 

// Test Route
app.get('/', (req, res) => {
  res.send('BrokeNoMore backend is up and running~');
});

// Serve static files (optional, if you're not using Go Live)
app.use(express.static('Frontend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});