
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
<<<<<<< HEAD
=======
const expenseRoutes = require('./routes/expenseRoutes');
>>>>>>> da21a3c9f73b332f5bfda51fd8138d693adba77a

// middleware:
app.use(cors());
<<<<<<< HEAD

app.use(express.json());
=======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// import routes here:

const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// use routes here:

>>>>>>> da21a3c9f73b332f5bfda51fd8138d693adba77a
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api', budgetRoutes);
app.use('/api', alertRoutes);
app.use('/api', summaryRoutes);

<<<<<<< HEAD
=======
app.get('/', (req, res) => {
    res.send('BrokeNoMore backend is up and running~');
});

>>>>>>> da21a3c9f73b332f5bfda51fd8138d693adba77a
module.exports = app;

