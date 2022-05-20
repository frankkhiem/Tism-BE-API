const express = require('express');
const { validate } = require('express-validation');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const conversationValidation = require('../../middlewares/validations/conversation.validation');
const conversationController = require('../../controllers/conversationController');

const router = express.Router();

// Use middleware checkAuth for user authenticate
router.use(authMiddleware.checkAuth);

// API get list conversation for user
router.get('/', conversationController.getListConversations);

// API get a conversation information
router.get('/:conversationId', validate(conversationValidation.getConversation), conversationController.getConversation);

// API send a text message to conversation
router.post('/:conversationId/text-message', validate(conversationValidation.sendTextMessage), conversationController.sendTextMessage);

// API mark seen tag for conversation
router.patch('/:conversationId/seen', validate(conversationValidation.seenConversation), conversationController.seenConversation);

module.exports = router;
