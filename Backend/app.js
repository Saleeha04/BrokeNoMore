
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');



app.use(cors()); 


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);


module.exports = app;
