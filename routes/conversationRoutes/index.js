const express = require('express');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
// const friendValidation = require('../../middlewares/validations/friend.validation');
const conversationController = require('../../controllers/conversationController');

const router = express.Router();

// Use middleware checkAuth for user authenticate
router.use(authMiddleware.checkAuth);

// API get list conversation for user
router.get('/', conversationController.getListConversations);

// API get a conversation information
router.get('/:conversationId', conversationController.getConversation);

// API send a text message to conversation
router.post('/:conversationId/text-message', conversationController.sendTextMessage);

// API mark seen tag for conversation
router.patch('/:conversationId/seen', conversationController.seenConversation);

module.exports = router;
