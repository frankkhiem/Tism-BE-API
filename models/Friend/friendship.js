const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendshipSchema = new Schema({
  firstPerson: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  secondPerson: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  collection: 'friendships',
  timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
