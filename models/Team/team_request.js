const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamRequestSchema = new Schema({
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    inviter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    invitee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accept: {
        type: String
    }
},
    {
        collection: 'team_requests',
        timestamps: true
    });

const teamRequest = mongoose.model('teamRequest', teamRequestSchema);

module.exports = teamRequest;
