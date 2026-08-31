function errorHandler(err, req, res, next) {
  console.error(`[${req.id}]`, err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message, requestId: req.id });
}

module.exports = errorHandler;
