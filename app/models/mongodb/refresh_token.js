const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RefreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema, 'refresh_tokens');
