const { response } = require('express');
const taskService = require('../../services/taskService');
const User = require('../../models/User');
const Team = require('../../models/Team');

// [GET] /alltasks
const getAllTasks = async(req, res) => {
    try {
        const userId = req.userId;
        const teamId = req.params.teamid;
        const team = await Team.findById(teamId);
        const result = await taskService.getAllTasks({
            team,
            userId
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};

//// [GET] /mytasks get all my task
const getMyTasks = async(req, res) => {
    try {
        const userId = req.userId;
        const result = await taskService.getMyTasks({
            userId
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};
// [GET] /task
const getTask = async(req, res) => {
    try {
        const taskId = req.params.taskid;
        const result = await taskService.getTask({
            taskId
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};

//[POST] create new task 
const createTask = async(req, res) => {
    try {
        const userId = req.userId;
        const teamId = req.body.teamId;
        const taskName = req.body.taskName;
        const taskType = req.body.taskType;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const executorArray = req.body.executor;

        //const description = req.body.description;
        const result = await taskService.createTask({
            userId,
            teamId,
            taskName,
            taskType,
            startTime,
            endTime,
            executorArray
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};

//update task
const updateTask = async(req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.body.taskId;
        const taskName = req.body.taskName;
        const taskType = req.body.taskType;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const executor = req.body.executor;
        const result = await taskService.updateTask({ userId, taskId, taskName, taskType, startTime, endTime, executor });

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};
//remove task
const removeTask = async(req, res) => {
    try {
        const userId = req.userId;
        const { taskId } = req.params;
        const result = await taskService.removeTask({ taskId, userId });

        if (result.success) {
            return res.status(200).json(result);
        }

        return res.status(400).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};

module.exports = {
    getTask,
    getMyTasks,
    createTask,
    getAllTasks,
    removeTask,
    updateTask,
};