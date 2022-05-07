const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendChatSchema = new Schema({
    friend_chats: [
    {
        message: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
    ],
},
{
    collection: 'friend_chat',
    timestamps: true
});

const Friend_chat = mongoose.model('friend_chat', friendChatSchema);

module.exports = Friend_chat;