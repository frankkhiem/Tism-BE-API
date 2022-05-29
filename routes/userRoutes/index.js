const express = require('express');
const multer = require('multer');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const userValidations = require('../../middlewares/validations/user.validation');
const userController = require('../../controllers/userController');
const multerHelper = require('../../helpers/multer');

const router = express.Router();
const uploadAvatar = multer({ 
  storage: multerHelper.storage,
  fileFilter: multerHelper.imageFilter
});

// Use middleware checkAuth for user authenticate
router.use(authMiddleware.checkAuth);

// API get user profile
router.get('/profile', userController.getProfile);

// API get user status
router.get('/status', userController.getUserStatus);

// API get person status
router.get('/:personId/status', userController.getPersonStatus);

// API edit user status
router.patch('/status', userController.editUserStatus);

// API edit user avatar
router.patch('/avatar', userValidations.editUserAvatar, userController.editUserAvatar);

// API upload image for change user avatar
router.post('/avatar/upload', uploadAvatar.single('avatar'), userController.uploadUserAvatar);

// API edit user desciption
router.patch('/description', userValidations.editUserDescription, userController.editUserDescription);

// API update user name
router.put('/profile', userController.updateUsername);
module.exports = router;
//
