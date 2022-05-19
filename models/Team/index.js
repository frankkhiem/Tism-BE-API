const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  admin:{
    type:String
  },

  teamName:{
    type: String,
    required: [true, "Team name is required"]
  },

  type: {
      type: String,
      required: true
  },

  is_private: {
    type: String,
    required: true
  },

  avatar:{
    type: String
  },
  
  member:[String],

  description: String,
},
{
  collection: 'teams',
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;