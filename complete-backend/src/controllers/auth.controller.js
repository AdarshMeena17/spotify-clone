const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const crypto = require('crypto');
const { sendOtpEmail } = require('../services/email.service');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../models/refreshToken.model');

async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('[auth] Register request received', { email });
    const safeRole = role === 'artist' ? 'artist' : 'user';

    let user = await User.findOne({ email });
    if (user?.isVerified) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('[auth] OTP generated', { email });

    const isNewUser = !user;
    const previousOtp = user && {
      otpHash: user.otpHash,
      otpExpiresAt: user.otpExpiresAt
    };

    if (isNewUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: safeRole,
        isVerified: false,
        otpHash,
        otpExpiresAt
      });
    } else {
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    try {
      console.log('[auth] Calling OTP email service', { email });
      const emailResult = await sendOtpEmail(email, otp);
      console.log('[auth] OTP email sent', { email, id: emailResult?.id });
    } catch (error) {
      if (isNewUser) {
        await User.deleteOne({ _id: user._id, isVerified: false });
      } else {
        user.otpHash = previousOtp.otpHash;
        user.otpExpiresAt = previousOtp.otpExpiresAt;
        await user.save();
      }

      return res.status(500).json({ message: 'Unable to send verification email' });
    }

    return res.status(201).json({
      message: 'OTP sent to your email',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
      
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: 'Email is already verified'
      });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt <= new Date()) {
      return res.status(400).json({
        message: 'OTP has expired'
      });
    }

    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    if (hashedOtp !== user.otpHash) {
      return res.status(400).json({
        message: 'Invalid OTP'
      });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'OTP verification failed',
      error: error.message
    });
    
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (!user.isVerified) {
  return res.status(403).json({
    message: 'Please verify your email before logging in'
  });
}

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

   const accessToken = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: '15m' }
);

const jti = uuidv4();

const refreshToken = jwt.sign(
  { userId: user._id, role: user.role, jti },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

await RefreshToken.create({
  userId: user._id,
  jti,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

const isProduction = process.env.NODE_ENV === 'production';

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    return res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token missing'
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
      jti: decoded.jti
    });

    if (!storedToken) {
      return res.status(401).json({
        message: 'Refresh token is invalid or revoked'
      });
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });

      return res.status(401).json({
        message: 'Refresh token has expired'
      });
    }

    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        role: decoded.role
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: '15m'
      }
    );

    return res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid refresh token'
    });
  }
}

function logout(req, res) {
  res.clearCookie('token');
  return res.json({ message: 'Logout successful' });
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { register,verifyOtp,  refreshAccessToken, login, logout, getCurrentUser };
