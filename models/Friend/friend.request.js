const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendRequestSchema = new Schema({
  inviter: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  invitee: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  collection: 'friend_requests',
  timestamps: true
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
