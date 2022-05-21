const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    friends: [
    {
        friend: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        chat:{
            type: Schema.Types.ObjectId,
            ref: 'Friend'
        }
    }
    ],

    friend_invite: [
    {
        invite_friend: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
    ],
},
{
    collection: 'friend',
    timestamps: true
});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
const Friendship = require('./friendship');
const FriendRequest = require('./friend.request');
const FriendMessage = require('./friend.message');

module.exports = {
  Friendship,
  FriendRequest,
  FriendMessage
};
