const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendMessageSchema = new Schema({
  friendship: {
    type: Schema.Types.ObjectId,
    ref: 'Friendship'
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'video-call'],
    default: 'text'
  },
  content: String,
  description: String
},
{
  collection: 'friend_messages',
  timestamps: true
});

const FriendMessage = mongoose.model('FriendMessage', friendMessageSchema);

module.exports = FriendMessage;