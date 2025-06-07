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
