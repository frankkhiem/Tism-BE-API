const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendMessageSchema = new Schema({
  Channel: {
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
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  content: String
},
{
  collection: 'friendships',
  timestamps: true
});

const FriendMessage = mongoose.model('FriendMessage', friendMessageSchema);

module.exports = FriendMessage;
