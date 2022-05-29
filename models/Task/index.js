const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    assign: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },

    name: {
        type: String,
        required: [true, "Task Name is required"]
    },

    type: {
        type: Number, // 0 - Todo, 1 - Pending, 2 - Finished
        required: [true, "Task Type is required"]
    },

    start_time: {
        type: Date,
        required: true
    },

    end_time: {
        type: Date,
        required: true
    },

    executor: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    files: [{
        type: String,
    }],

    comments: [{
        comment: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }],

    description: String,
}, {
    collection: 'tasks',
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;