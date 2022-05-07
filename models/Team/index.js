const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  name:{
    type: String,
    required: [true, "Full name is required"]
  },

  type: {
      type: String,
      required: true
  },

  is_private: {
    type: String,
    required: true
  },

  admin:{
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  collection: 'users',
  timestamps: true
});

const Team = mongoose.model('User', teamSchema);

module.exports = Team;