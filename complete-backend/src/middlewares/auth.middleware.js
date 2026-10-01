const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authMiddleware(req, res, next) {
  let payload;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access token required'
      });
    }

    const accessToken = authHeader.split(' ')[1];

    payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired access token'
    });
  }

  try {
    const user = await User.findById(payload.userId).select('_id role');

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role
    };

    return next();
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to verify account'
    });
  }
}

module.exports = authMiddleware;