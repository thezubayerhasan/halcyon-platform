const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const nasaDataService = require('./services/nasaDataService');

const app = express();
const PORT = process.env.PORT || 3000;
const ee = require('@google/earthengine');
const privateKey = require('./unpaid-usage-473921-3933d28a9a72.json'); // Use the correct path

ee.data.authenticateViaPrivateKey(
  privateKey,
  () => {
    console.log('Earth Engine authentication successful.');
    ee.initialize(
      null,
      null,
      () => {
        console.log('Earth Engine client library initialized.');
        // Start your server or continue with your app logic here
      },
      (err) => {
        console.error('Earth Engine initialization error:', err);
      }
    );
  },
  (err) => {
    console.error('Earth Engine authentication error:', err);
  }
);
// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration for Vercel deployment


const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://halcyon-platform.vercel.app'] // your deployed frontend domain
  : ['http://localhost:3000', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Halcyon Backend API'
    });
});

// Initialize NASA data services
nasaDataService.initialize().then(() => {
    console.log('NASA data services initialized successfully');
}).catch(error => {
    console.error('Failed to initialize NASA services:', error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`Halcyon Backend API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;