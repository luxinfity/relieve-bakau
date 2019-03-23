const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const AddressSchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    user_id: {
        type: Types.UUID,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        type: Object,
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
}, options);


// Relation to emergency contact
AddressSchema.virtual('emergency_contacts', {
    ref: 'EmergencyContact',
    localField: '_id',
    foreignField: 'address_id'
});

module.exports = model('Address', AddressSchema, 'addresses');
