const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes'); // or './Routes/userRoute' if unchanged
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('BrokeNoMore backend is running!');
});

module.exports = app;
