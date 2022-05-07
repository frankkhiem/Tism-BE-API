const express = require('express');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const userValidations = require('../../middlewares/validations/user.validation');
const userController = require('../../controllers/userController');

const router = express.Router();

// Use middleware checkAuth for user authenticate
router.use(authMiddleware.checkAuth);

// API get user profile
router.get('/profile', userController.getProfile);

// API edit user desciption
router.patch('/description', userValidations.editUserDescription, userController.editUserDescription);

// API update user name
router.put('/profile', userController.updateUsername);
module.exports = router;
