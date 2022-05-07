const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
      type: String,
      required: true
  },

  email: {
    type: String,
    match: [/\S+@\S+\.\S+/, 'invalid']
  },
  
  phone: {
      type: String,
      maxlength:[100, 'invalid'],
      required:[true, "must be filled"],
      match: [/^[0-9]+$/,'invalid']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  collection: 'Contact',
  timestamps: true
});

const contact = mongoose.model('Contact', contactSchema);

module.exports = contactSchema;