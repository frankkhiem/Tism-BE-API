const express = require('express');
const { validate } = require('express-validation');
const multer = require('multer');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const conversationValidation = require('../../middlewares/validations/conversation.validation');
const conversationController = require('../../controllers/conversationController');
const multerHelper = require('../../helpers/multer');

const router = express.Router();
const uploadImage = multer({ 
  storage: multerHelper.storage,
  fileFilter: multerHelper.imageFilter
});
const uploadFile = multer({ 
  storage: multerHelper.storage ,
  fileFilter: multerHelper.fileFilter
});

// Use middleware checkAuth for user authenticate
router.use(authMiddleware.checkAuth);

// API get list conversation for user
router.get('/', conversationController.getListConversations);

// API get a conversation information
router.get(
  '/:conversationId', 
  validate(conversationValidation.getConversation), 
  conversationController.getConversation
);

// API send a text message to conversation
router.post(
  '/:conversationId/text-message', 
  validate(conversationValidation.sendTextMessage), 
  conversationController.sendTextMessage
);

// API send a image message to conversation
router.post(
  '/:conversationId/image-message',
  uploadImage.single('image-message'),
  conversationController.sendImageMessage
);

// API send a file message to conversation
router.post(
  '/:conversationId/file-message',
  uploadFile.single('file-message'),
  conversationController.sendFileMessage
);

// API mark seen tag for conversation
router.patch(
  '/:conversationId/seen', 
  validate(conversationValidation.seenConversation), 
  conversationController.seenConversation
);

// API mark seen tag for conversation
router.get(
  '/:conversationId/messages', 
  validate(conversationValidation.getRecentMessages),
  conversationController.getRecentMessages
);

module.exports = router;
