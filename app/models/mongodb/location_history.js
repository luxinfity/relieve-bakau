const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const LocationHistorySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    location: {
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
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('LocationHistory', LocationHistorySchema, 'location_histories');
