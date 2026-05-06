require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/restaurants', require('./routes/restaurant.routes'));
app.use('/api/v1/user', require('./routes/user.routes'));

// Health check
app.get('/', (req, res) => res.json({ success: true, message: 'Restaurant API running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
