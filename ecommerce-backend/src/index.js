/**
 * =============================================================================
 * ECOMMERCE BACKEND - Main Entry Point
 * =============================================================================
 * 
 * This is a template/starter backend for the Ecommerce application.
 * It provides: 
 * - Health check endpoint (/health) - Required for Docker and load balancers
 * - API placeholder route (/api) - Add your routes here
 * - Graceful shutdown handling - Properly closes connections when stopping
 * 
 * Usage: 
 *   Development: npm run dev (with nodemon for auto-reload)
 *   Production:  npm start or node src/index.js
 * 
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// Import Dependencies
// -----------------------------------------------------------------------------

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// Read PORT from environment variable, default to 4000
// This allows flexibility - can be changed without modifying code
const PORT = process.env.PORT || 4000;

// Get environment (development, staging, production)
const NODE_ENV = process.env.NODE_ENV || 'development';

// -----------------------------------------------------------------------------
// Initialize Express App
// -----------------------------------------------------------------------------

const app = express();

// -----------------------------------------------------------------------------
// Middleware Setup
// -----------------------------------------------------------------------------

// Helmet - Security headers
// Adds headers like X-Content-Type-Options, X-Frame-Options, etc.
// Always use in production for security
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
// Allows frontend (different origin) to call this API
// Configure allowed origins in production for security
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // In production, set specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON body parser
// Parses incoming JSON requests and puts data in req.body
app.use(express.json({ limit: '10mb' }));

// URL-encoded body parser
// Parses form data
app.use(express.urlencoded({ extended: true, limit:  '10mb' }));

// -----------------------------------------------------------------------------
// Request Logging Middleware
// -----------------------------------------------------------------------------

// Simple request logger (replace with Morgan or Winston in production)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// -----------------------------------------------------------------------------
// Health Check Endpoint
// -----------------------------------------------------------------------------

/**
 * GET /health
 * 
 * Health check endpoint used by: 
 * - Docker HEALTHCHECK command
 * - Load balancers (ALB, Nginx) to check if service is alive
 * - Kubernetes liveness/readiness probes
 * - Monitoring systems (Prometheus, Datadog, etc.)
 * 
 * Returns:
 * - status: "ok" if healthy, "error" if not
 * - timestamp: current server time
 * - uptime: how long the server has been running
 * - environment: current environment (dev/staging/prod)
 */
app.get('/health', (req, res) => {
  // You can add more checks here: 
  // - Database connection
  // - Redis connection
  // - External service availability
  
  const healthcheck = {
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  };

  try {
    // Add any additional health checks here
    // Example: Check database connection
    // await db.ping();
    
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.status = 'error';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
});

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

/**
 * GET /api
 * 
 * Root API endpoint - returns API information
 */
app.get('/api', (req, res) => {
  res.json({
    message: 'Ecommerce API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
      // Add your endpoints documentation here
      // products: 'GET /api/products',
      // users: 'GET /api/users',
      // orders: 'GET /api/orders',
    },
  });
});

/**
 * API Routes Placeholder
 * 
 * Add your actual API routes here.  Examples:
 * 
 * // Products routes
 * app.get('/api/products', (req, res) => { ... });
 * app.get('/api/products/:id', (req, res) => { ... });
 * app.post('/api/products', (req, res) => { ... });
 * 
 * // Users routes
 * app.get('/api/users', (req, res) => { ... });
 * app.post('/api/users/login', (req, res) => { ... });
 * 
 * // Orders routes
 * app.get('/api/orders', (req, res) => { ... });
 * app.post('/api/orders', (req, res) => { ... });
 */

// Example: Products endpoint (placeholder)
app.get('/api/products', (req, res) => {
  // This is a placeholder - replace with actual database query
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Sample Product 1', price: 29.99 },
      { id: 2, name: 'Sample Product 2', price: 49.99 },
      { id: 3, name:  'Sample Product 3', price: 19.99 },
    ],
    message: 'This is sample data.  Connect your database to get real products.',
  });
});

// -----------------------------------------------------------------------------
// Error Handling Middleware
// -----------------------------------------------------------------------------

// 404 Handler - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req. path}`,
    path: req.path,
  });
});

// Global Error Handler
// Catches all errors thrown in the application
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't expose error details in production
  const errorResponse = {
    success: false,
    error: NODE_ENV === 'production' ?  'Internal Server Error' : err.message,
    ...(NODE_ENV !== 'production' && { stack:  err.stack }),
  };

  res.status(err.status || 500).json(errorResponse);
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('ECOMMERCE BACKEND SERVER');
  console.log('='.repeat(60));
  console.log(`Environment:   ${NODE_ENV}`);
  console.log(`Port:         ${PORT}`);
  console.log(`Health:       http://localhost:${PORT}/health`);
  console.log(`API:          http://localhost:${PORT}/api`);
  console.log('='.repeat(60));
  console.log('Server is ready to accept requests');
  console.log('='.repeat(60));
});

// -----------------------------------------------------------------------------
// Graceful Shutdown
// -----------------------------------------------------------------------------

/**
 * Graceful shutdown handling
 * 
 * When the container receives SIGTERM (from Docker stop) or SIGINT (Ctrl+C):
 * 1. Stop accepting new connections
 * 2. Wait for existing requests to complete
 * 3. Close database connections (if any)
 * 4. Exit the process
 * 
 * This prevents data corruption and ensures clean shutdowns
 */
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received.  Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Add cleanup tasks here: 
    // - Close database connections
    // - Close Redis connections
    // - Flush logs
    // - etc.
    
    console.log('Graceful shutdown completed.');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long (30 seconds)
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors (prevents server crashes)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - just log (you might want to exit in production)
});