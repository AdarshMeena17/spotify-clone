
const express = require('express');

const authController = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/refresh', authController.refreshAccessToken);
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getCurrentUser);

module.exports = router;