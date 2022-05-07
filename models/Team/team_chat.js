const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamChatSchema = new Schema({
    friend_chats: [
    {
        content: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
    ],
},
{
    collection: 'team_chat',
    timestamps: true
});

const Team_chat = mongoose.model('team_chat', teamChatSchema);

module.exports = Team_chat;