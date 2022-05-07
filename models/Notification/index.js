const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    title: String,
    content: String,
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    collection: 'team_chat',
    timestamps: true
});

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;