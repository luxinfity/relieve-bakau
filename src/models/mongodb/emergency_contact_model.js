const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const EmergencyContactSchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    address_id: {
        type: Types.UUID,
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
}, options);

module.exports = model('EmergencyContact', EmergencyContactSchema, 'emergency_contacts');
