const express = require('express');
const authMiddleware = require('../../middlewares/auth/auth.middleware');
const taskController = require('../../controllers/taskController');

const router = express.Router();
router.use(authMiddleware.checkAuth);

//[GET] get task's detail
router.get('/gettask/:taskid', taskController.getTask);
//[GET] get all my tasks
router.get('/getmytasks', taskController.getMyTasks);
//[POST] create task 
router.post('/createtask', taskController.createTask);
//[GET] get user's all task
router.get('/getalltasks/:teamid', taskController.getAllTasks);
//[DELETE] remove task 
router.delete('/:taskId/removetask', taskController.removeTask);
//[PUT] update task's detail
router.put('/updatetask', taskController.updateTask);
module.exports = router;