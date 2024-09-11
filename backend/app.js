const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const cors = require('cors');
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.status(200).send('Server is up and running');
  });
app.use('/api/auth', authRoutes);

module.exports = app;