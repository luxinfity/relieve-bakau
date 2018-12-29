const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const FamilySchema = new Schema({
    uuid: {
        type: String,
        default: uuid.v4,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    family: {
        id: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: null
        },
        nick: {
            type: String,
            default: null
        }
    }
}, { versionKey: false });

module.exports = model('Family', FamilySchema, 'families');
