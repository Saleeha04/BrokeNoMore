const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Middleware: CORS
app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:5502'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Middleware: JSON & URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Session handling
app.use(session({
    secret: 'secretShushKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3, // 3 hours
        httpOnly: true,
        sameSite: 'lax',
        secure: false // Set to true if using HTTPS
    }
}));

// use routes here:

app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api', budgetRoutes);
app.use('/api', alertRoutes);
app.use('/api', summaryRoutes);

app.get('/', (req, res) => {
    res.send('BrokeNoMore backend is up and running~');
});

module.exports = app;