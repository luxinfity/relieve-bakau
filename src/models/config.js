const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const ConfigSchema = new Schema({
    uuid: {
        type: String,
        default: uuid.v4,
        required: true
    },
    key: {
        type: String,
        default: null
    },
    value: {
        type: String,
        required: true
    }
}, { versionKey: false });

module.exports = model('Config', ConfigSchema, 'configs');
