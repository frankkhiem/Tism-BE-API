const express = require('express');
const authMiddleware = require('../../middlewares/auth/auth.middleware');
const teamController = require('../../controllers/teamController');

const router = express.Router();
router.use(authMiddleware.checkAuth);

//[GET] get team's detail
router.get('/team',  teamController.getTeam);
//[POST] create team 
router.post('/newteam',  teamController.createTeam);

module.exports = router;