// server.js - Entry point for the application
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const db = require('./database');
const routes = require('./routes');

// Initialize express app
const app = express();
const port = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging middleware

// Register routes
app.use('/api', routes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start the server
const startServer = async () => {
  await db.initialize();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await db.close();
  process.exit(0);
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app; // Export for testing