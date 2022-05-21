const express = require('express');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const friendValidation = require('../../middlewares/validations/friend.validation');
const friendController = require('../../controllers/friendController');

const router = express.Router();

// Use middleware checkAuth for user authenticate
router.use(authMiddleware.checkAuth);

// API get list friends
router.get('/', friendController.getListFriends);

// API search current friends by keyword
router.get('/search', friendValidation.searchFriends, friendController.searchFriends);

// API find new friends by keyword
router.get('/find', friendValidation.searchFriends, friendController.findFriends);

// API get list invitations sended
router.get('/invitations-sended', friendController.getInvitationSended);

// API get list invitations received
router.get('/invitations-received', friendController.getInvitationReceived);

// API send invitation friend by personId
router.post('/invitation', friendValidation.sendInvitationFriend, friendController.sendInvitationFriend);

// API cancel invitation friend by personId
router.delete('/invitation/:personId', friendValidation.cancelInvitationFriend, friendController.cancelInvitationFriend);

// API decline invitation friend by personId
router.delete('/invitation/:personId/decline', friendValidation.cancelInvitationFriend, friendController.declineInvitationFriend);

// API accept invitation friend by personId
router.post('/accept', friendValidation.acceptInvitationFriend, friendController.acceptInvitationFriend);

// API unfriend by friendId
router.delete('/:friendId/unfriend', friendValidation.unFriend, friendController.unFriend);

// API get 1 person information
router.get('/person/:personId/info', friendValidation.getPersonInfo, friendController.getPersonInfo);

// API get list mutual friends with another person
router.get('/person/:personId/mutual-friends', friendValidation.getPersonInfo, friendController.getListMutualFriends);

module.exports = router;
