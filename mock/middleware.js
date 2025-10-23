module.exports = (req, res, next) => {
  if (!req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'Use /api/* endpoints only' });
  }
  req.url = req.url.replace('/api', '');
  next();
};
