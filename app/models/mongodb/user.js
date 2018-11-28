const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
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
        type: Boolean,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema);
