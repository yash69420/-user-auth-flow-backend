const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Ensure this path is correct
const authMiddleware = require('../middlewares/auth'); // Ensure this path is correct

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS with default settings (allow requests from any origin)
app.use(cors());

// JSON Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Use authentication routes
app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
