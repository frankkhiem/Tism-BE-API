const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"]
  },
  normalizeName: {
    type: String
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
  avatar: String,
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],
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
