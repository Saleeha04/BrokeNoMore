
const express = require('express');
const cors = require('cors');
const app = express();








// import routes here:
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');



app.use(cors()); 
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);


module.exports = app;

