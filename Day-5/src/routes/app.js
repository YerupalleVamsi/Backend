const express = require('express');
const productsRouter = require('./products');

const app = express();

app.use(express.json());

app.use('/products', productsRouter);

// Example: start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
