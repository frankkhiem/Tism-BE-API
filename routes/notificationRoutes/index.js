const express = require('express');
const authMiddleware = require('../../middlewares/auth/auth.middleware');
const notificationController = require('../../controllers/notificationController');

const router = express.Router();
router.use(authMiddleware.checkAuth);

//[GET] get all notification of current user
router.get('/getallnotification', notificationController.getAllNotifications);

module.exports = router;