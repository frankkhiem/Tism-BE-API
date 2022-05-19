const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendshipSchema = new Schema({
  firstPerson: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  firstPersonSeen: {
    type: Boolean,
    default: false
  },
  secondPerson: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  secondPersonSeen: {
    type: Boolean,
    default: false
  },
},
{
  collection: 'friendships',
  timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
