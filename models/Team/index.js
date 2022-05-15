const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  admin:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  
  member:[
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  ],
  created_date: {
    type: Date,
    required: true
  },

  description: String,
},
{
  collection: 'teams',
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;