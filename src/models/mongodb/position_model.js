const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const PositionSchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    user_id: {
        type: Types.UUID,
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
    },
    status: {
        type: Number,
        enum: [10, 20, 30],
        required: true
    },
    is_latest: {
        type: Boolean,
        default: false,
        required: true
    }
}, options);

module.exports = model('Position', PositionSchema, 'positions');
