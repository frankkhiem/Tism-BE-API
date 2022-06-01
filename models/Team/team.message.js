const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamMessageSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'meeting'],
    default: 'text'
  },
  content: String,
  description: String
},
{
  collection: 'team_messages',
  timestamps: true
});

const TeamMessage = mongoose.model('TeamMessage', teamMessageSchema);

module.exports = TeamMessage;