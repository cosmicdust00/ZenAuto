const jwt = require('jsonwebtoken');

const authorizeToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new Error('Access token is required', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new Error('Invalid or expired token', 401));
    }
    req.user = user;
    next();
  });
};

module.exports = { authorizeToken };
