const express = require('express');
const productsRouter = require('./src/routes/products');
const logger = require('./src/middleware/logger');
const requestId = require('./src/middleware/requestId');
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');

const app = express();
app.use(express.json());

// Middlewares
app.use(logger);
app.use(requestId);

// Routes
app.use('/products', productsRouter);

// Test route to verify the error handler
app.get('/error-test', () => {
  const errors = [
    () => { throw new Error('Random failure: file not found'); },
    () => { throw new TypeError('Random failure: cannot read property of undefined'); },
    () => { null.boom(); },
  ];
  const random = errors[Math.floor(Math.random() * errors.length)];
  random();
});

// 404 handler
app.use(notFound);

// Error handler (last)
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
