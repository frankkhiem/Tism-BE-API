const express = require('express');
const multer = require('multer');

const authMiddleware = require('../../middlewares/auth/auth.middleware');
const teamController = require('../../controllers/teamController');
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

router.use(authMiddleware.checkAuth);

//[GET] get team's detail
router.get('/getteam/:id', teamController.getTeam);

//[GET] get team members information
router.get('/:teamId/members', teamController.getTeamMembersInfo);

//[POST] create team 
router.post('/newteam', teamController.createTeam);

//[GET] get user's all team
router.get('/getallteam', teamController.getAllTeam);

//[DELETE] remove team 
router.delete('/:teamId/removeteam', teamController.removeTeam);

//[PUT] update team's detail
router.put('/updateteam', teamController.updateTeamDetail);

//[GET] get user's all invite from team
router.get('/getallinvite', teamController.getAllInvite);

//[PATCH] resqponse for an invite
router.patch('/responseinvite', teamController.responseForInvite);

//[POST] create team's invite to anyone 
router.post('/invitetopeople', teamController.addMoreInvite);

//[GET] get list messages in team
router.get('/:teamId/messages', teamController.getRecentTeamMessages);

//[POST] send text message to a team 
router.post('/:teamId/text-message', teamController.sendTextMessage);

// API send a image message to team
router.post(
  '/:teamId/image-message',
  uploadImage.single('image-message'),
  teamController.sendImageMessage
);

// API send a file message to team
router.post(
  '/:teamId/file-message',
  uploadFile.single('file-message'),
  teamController.sendFileMessage
);

//[DELETE] delete a message in team
router.delete('/:teamId/messages/:messageId', teamController.deleteMessage);

module.exports = router;