const express = require('express');
const authMiddleware = require('../../middlewares/auth/auth.middleware');
const teamController = require('../../controllers/teamController');

const router = express.Router();
router.use(authMiddleware.checkAuth);

//[GET] get team's detail
router.get('/getteam/:id', teamController.getTeam);
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
router.patch('/responseinvite',teamController.responseForInvite);
//[POST] create team's invite to anyone 
router.post('/invitetopeople',teamController.addMoreInvite);
module.exports = router;