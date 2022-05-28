const createError = require("http-errors");
// const { translateAliases } = require("../../models/User");

const Task = require('../../models/Task');
const User = require('../../models/User');


const getAllTasks = async({ user }) => {
    var allTasks = new Array();
    const tasks = await Task.find({});
    tasks.map(task => {
        if (task.team == team._id) {
            allTasks.push(task);
        }
    })
    return allTasks;
}

//get team's detail
const getTask = async({ taskId }) => {
    try {
        const task = await Task.findById(taskId);
        return task;
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
};

// create new team
const createTask = async({
    userId,
    teamId,
    taskName,
    taskType,
    startTime,
    endTime,
    executorId
}) => {
    try {
        assigner = userId.toString();
        const newTask = new Task({
            assign: assigner,
            team: teamId,
            name: taskName,
            type: taskType,
            start_time: startTime,
            end_time: endTime,
            executor: executorId
        });
        const task = await newTask.save();

        return task;
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
};

//update team's detail
const updateTask = async ({ taskId, taskName, taskType, startTime, endTime, executorId }) => {
    try {
        let task = await Task.findById(taskId);

        task.name = taskName;
        task.type = taskType;
        task.start_time = startTime;
        task.end_time = endTime;
        task.executor = executorId;

        await task.save();
        return {
            success: true,
            message: 'Updated task successfully'
        };
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
};

//remove team
const removeTask = async({ taskId }) => {
    try {
        const task = await Task.findByIdAndRemove(taskId)
        return {
            success: true,
            message: 'Removed task successfully'
        };
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
}

module.exports = {
    getTask,
    createTask,
    getAllTasks,
    updateTask,
    removeTask,
};