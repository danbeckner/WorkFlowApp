const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user session schema for storage in the database
const UserSessionSchema = new mongoose.Schema({
    // will be used as the user token
    userId: {
        type: String,
        default: -1
    },
    userFirstName: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    // clears token from userSession
    isEnded: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('UserSession', UserSessionSchema);