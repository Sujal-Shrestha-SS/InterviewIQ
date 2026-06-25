const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check — your first test point
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;