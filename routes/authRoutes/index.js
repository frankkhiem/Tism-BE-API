const express = require('express');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const authValidation = require('../../middlewares/validations/auth.validation');
const authController = require('../../controllers/authController');

const router = express.Router();

// API login
router.post('/login', authValidation.login, authController.login);

// API register
router.post('/register', authValidation.register, authController.register);

// API refresh token
router.post('/refresh-token', authValidation.refreshToken, authController.refreshToken);

// API logout
router.post('/logout', authMiddleware.checkAuth, authController.logout);

module.exports = router;
