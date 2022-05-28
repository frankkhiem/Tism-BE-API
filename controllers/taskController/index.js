const { response } = require('express');
const taskService = require('../../services/taskService');
const User = require('../../models/User');
const Team = require('../../models/Team');

// [GET] /alltasks
const getAllTasks = async(req, res) => {
    try {
        const teamId = req.params.teamid;
        const team = await Team.findById(teamId);
        const result = await taskService.getAllTasks({
            team
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
        const executorId = req.body.executorId;

        //const description = req.body.description;
        const result = await taskService.createTask({
            userId,
            teamId,
            taskName,
            taskType,
            startTime,
            endTime,
            executorId
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
        const taskId = req.body.taskId;
        const taskName = req.body.taskName;
        const taskType = req.body.taskType;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const executorId = req.body.executorId;
        const result = await taskService.updateTask({ taskId, taskName, taskType, startTime, endTime, executorId });

        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 400);
        res.json(error);
    }
};
//remove task
const removeTask = async(req, res) => {
    try {
        const { taskId } = req.params;
        const result = await taskService.removeTask({ taskId });

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
    createTask,
    getAllTasks,
    removeTask,
    updateTask,
};