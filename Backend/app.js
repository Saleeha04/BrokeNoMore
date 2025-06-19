<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const app = express();
<<<<<<< HEAD
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');



app.use(cors()); 


=======

// middleware:
app.use(cors());
>>>>>>> 9c6a5657d894f07dc2732fbeee745a72c5280090
app.use(express.json());

// import routes here:
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// use routes here:
app.use('/api/users', userRoutes);
<<<<<<< HEAD
app.use('/api/expenses', expenseRoutes);

=======
app.use('/api', budgetRoutes);
app.use('/api', alertRoutes);
app.use('/api', summaryRoutes);

app.get('/', (req, res) => {
    res.send('BrokeNoMore backend is up and running~');
});
>>>>>>> 9c6a5657d894f07dc2732fbeee745a72c5280090

module.exports = app;
=======
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const session = require('express-session');

// middleware:
app.use(cors({
    origin: 'http://localhost:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session handling coming through bzzz
app.use(session({
    secret: 'secretShushKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3, // 3 hour session hy.
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    }
}));

// import routes here:

const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

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
>>>>>>> 4b281f557d085b532739a437ae61706662b58dc3
