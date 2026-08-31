function auth(req, res, next) {
  console.log('>>> Auth middleware triggered'); // Debug
  const header = req.get('Authorization');
  console.log('>>> Authorization header value:', header);

  if (!header || header.trim() !== 'Bearer secret123') {
    console.log('>>> Auth failed');
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log('>>> Auth passed');
  next();
}

module.exports = auth;
