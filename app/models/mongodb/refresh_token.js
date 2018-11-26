const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RefreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    token: {
        type: String
    },
    expiredAt: {
        type: Date
    }
}, { versionKey: false });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
