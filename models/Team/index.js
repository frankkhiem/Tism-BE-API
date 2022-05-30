const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  admin:{
    type:String
  },

  teamName:{
    type: String,
    required: true
  },

  type: {
      type: String,
      required: true
  },

  is_private: {
    type: String,
  },

  avatar:{
    type: String
  },

  invites: [String],
  
  member: [String],

  description: String,
},
{
  collection: 'teams',
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;