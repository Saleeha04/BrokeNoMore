const express = require('express');
const cors = require('cors');
const app = express();

// middleware:
app.use(cors());
app.use(express.json());

// import routes here:
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// use routes here:
app.use('/api/users', userRoutes);
app.use('/api', budgetRoutes);
app.use('/api', alertRoutes);
app.use('/api', summaryRoutes);

app.get('/', (req, res) => {
    res.send('BrokeNoMore backend is up and running~');
});

module.exports = app;
