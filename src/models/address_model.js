const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const AddressSchema = new Schema({
    uuid: {
        type: String,
        default: uuid.v4,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    geograph: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { versionKey: false });

module.exports = model('Address', AddressSchema, 'addresses');
