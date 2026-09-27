const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authMiddleware(req, res, next) {
  let payload;
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Please login first' });
    }

    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    const user = await User.findById(payload.userId).select('_id role');
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = { userId: user._id.toString(), role: user.role };
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Unable to verify account' });
  }
}

module.exports = authMiddleware;
