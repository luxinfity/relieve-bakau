const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const PlaceSchema = new Schema({
    id: {
        type: String,
        default: uuid.v4,
        required: true
    },
    google_place_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    geograph: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    phone: {
        type: String,
        required: true
    }
}, { versionKey: false });

module.exports = model('Place', PlaceSchema, 'places');
