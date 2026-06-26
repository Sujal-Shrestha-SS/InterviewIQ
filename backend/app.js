const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

const { errorHandler } = require('./middleware/error.middleware');
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check — your first test point
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


app.use(errorHandler);

module.exports = app;