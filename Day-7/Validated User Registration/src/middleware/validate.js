const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map(d => ({
        field: d.path.join("."),
        message: d.message.replace(/['"]/g, ""),
      })),
    });
  }
  req.body = value; // replace with validated/transformed data
  next();
};

module.exports = validate;