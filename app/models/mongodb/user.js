const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    birthdate: {
        type: Date
    },
    phone: {
        type: String
    },
    isComplete: {
        type: Boolean
    }
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema);
