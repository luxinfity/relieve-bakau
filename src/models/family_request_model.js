const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const FamilyRequestSchema = new Schema({
    uuid: {
        type: String,
        default: uuid.v4,
        required: true
    },
    requestor_id: {
        type: String,
        required: true
    },
    target_id: {
        type: String,
        required: true
    },
    pair_code: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 10
    }
}, { versionKey: false });

module.exports = model('FamilyRequest', FamilyRequestSchema, 'family_requests');