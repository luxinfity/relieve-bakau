const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const FamilyRequestSchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    requestor_id: {
        type: Types.UUID,
        required: true
    },
    target_id: {
        type: Types.UUID,
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
}, options);

FamilyRequestSchema.virtual('requestor', {
    ref: 'User',
    localField: 'requestor_id',
    foreignField: '_id',
    justOne: true
});

module.exports = model('FamilyRequest', FamilyRequestSchema, 'family_requests');
