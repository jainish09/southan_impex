const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const inquiryRoutes = require('./routes/inquiryRoutes');
const productRoutes = require('./routes/productRoutes');
const branchRoutes = require('./routes/branchRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB Database
connectDB();

const app = express();

// Security and Logging Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow connections from frontend dev server & static files
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Southern Impex REST API Backend is running seamlessly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register API Domain Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Southern Impex Backend listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`[Server] Health Check available at http://localhost:${PORT}/api/health`);
});
