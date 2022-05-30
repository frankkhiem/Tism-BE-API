const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    title: String,
    content: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type_notification: {
        type_of_notification: String,
        teamId: Schema.Types.ObjectId,
        friendId: Schema.Types.ObjectId
    },

},
    {
        collection: 'notifications',
        timestamps: true
    });

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;