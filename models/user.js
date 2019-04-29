const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// create user schema for storing user in the database
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    // siteId: {
    //     type: String,
    //     default: ''
    // },
    // company: {
    //     type: String,
    //     default: ''
    // },
    isDeleted: {
        type: Boolean,
        default: false
    },
    signUpDate: {
        type: Date,
        default: Date.now()
    }
});

// hash the password for storage in the database using bcrypt
UserSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

UserSchema.methods.checkValidPassword = password => {
    return bcrypt.compareSync(password, this.password);
};

mongoose.set('bufferCommands', false);

module.exports = mongoose.model('User', UserSchema);