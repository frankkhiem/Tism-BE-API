const createError = require("http-errors");
// const { translateAliases } = require("../../models/User");

const Task = require('../../models/Task');
const Team = require("../../models/Team");
const User = require('../../models/User');


const getAllTasks = async ({ team, userId }) => {
    if(!team.member.includes(userId.toString())) return "not have permission";
    var allTasks = new Array();
    const tasks = await Task.find({});
    tasks.map(task => {
        if (task.team == team.id) {
            allTasks.push(task);
        }
    })
    return allTasks;
}

//get team's detail
const getMyTasks = async ({ userId }) => {
    try {
        let myTasks = new Array();
        const tasks = await Task.find({});
        tasks.map(task => {
            for(let i=0; i < task.executor.length; i++)
            {
                if (task.executor[i].equals(userId)) {
                    myTasks.push(task);
                }
            }
        })
        return myTasks;
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
};

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
    executorArray
}) => {
    try {
        const team = await Team.findById(teamId)
        const executorIdArray = await transformExecutorArray({executorArray})

        assigner = userId.toString();
        if(!team.member.includes(assigner)) return "not have permission"
        const newTask = new Task({
            assign: assigner,
            team: teamId,
            name: taskName,
            type: taskType,
            start_time: startTime,
            end_time: endTime,
            executor: executorIdArray
        });
        const task = await newTask.save();

        return task;
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
};

//update team's detail
const updateTask = async ({ userId, taskId, taskName, taskType, startTime, endTime, executor }) => {
    try {   
        let task = await Task.findById(taskId);
        //console.log(task.assign, userId)
        if(task.assign.toString() != userId.toString()) return "not have permission"

        const executorIdArray = await transformExecutorArray({executorArray:executor})
        task.name = taskName;
        task.type = taskType;
        task.start_time = startTime;
        task.end_time = endTime;
        task.executor = executorIdArray;

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
const removeTask = async({ taskId, userId }) => {
    try {
        let task = await Task.findById(taskId);
        if(userId.toString() != task.assign.toString()) return "not have permission"
        await Task.findByIdAndRemove(taskId)
        return {
            success: true,
            message: 'Removed task successfully'
        };
    } catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
}
//transform executor email to executorId
const transformExecutorArray = async ({ executorArray }) => {
    try {
        if (executorArray === null) return
        let temp = new Array()
        for (let i = 0; i < executorArray.length; i++) {
            var user = await User.findOne({ 'email': executorArray[i] })
            temp.push(user.id)
        }
        return temp
    }
    catch (error) {
        throw createError(error.statusCode || 500, error.message);
    }
}

module.exports = {
    getTask,
    getMyTasks,
    createTask,
    getAllTasks,
    updateTask,
    removeTask,
};