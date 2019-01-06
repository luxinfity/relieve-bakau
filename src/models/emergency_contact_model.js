const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const EmergencyContactSchema = new Schema({
    uuid: {
        type: String,
        default: uuid.v4,
        required: true
    },
    address_id: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, { versionKey: false });

module.exports = model('EmergencyContact', EmergencyContactSchema, 'emergency_contacts');
