const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/error.middleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check — your first test point
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

//Error handler - must be last
app.use(errorHandler);

module.exports = app;