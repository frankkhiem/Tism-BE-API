const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"]
  },
  email: {
    type: String, 
    unique: true,
    required: [true, "Email is required"], 
    match: [/\S+@\S+/, 'Email is invalid'], 
    index: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  friend_relations: [
    {
      name: String,
      email: String
    }
  ],

  friend_invites: [
    {
      name: String,
      email: String
    }
  ],
  task_assign:[
    {
      task: {
        name: String,
        status: String,
        start_time: Date,
        end_time: Date,
        description: String,
        file: [],
        comment: []
      }
    }
  ],
  description: String,
  accessToken: String,
  refreshToken: String
},
{
  collection: 'users',
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;