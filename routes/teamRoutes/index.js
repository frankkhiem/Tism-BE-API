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
//[PUT] update team's detail
router.put('/updateteam', teamController.updateTeamDetail);
module.exports = router;