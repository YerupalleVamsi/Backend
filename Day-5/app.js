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

// 404 handler
app.use(notFound);

// Error handler (last)
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
