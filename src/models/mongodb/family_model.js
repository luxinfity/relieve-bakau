const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const FamilySchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    user_id: {
        type: Types.UUID,
        required: true
    },
    family_id: {
        type: Types.UUID,
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
}, options);

// Relation to user
FamilySchema.virtual('family', {
    ref: 'User',
    localField: 'family_id',
    foreignField: '_id',
    justOne: true
});

// Relation to position
FamilySchema.virtual('condition', {
    ref: 'Position',
    localField: 'family_id',
    foreignField: 'user_id',
    options: { where: { is_latest: true } }, // sort desc
    justOne: true // take latest one
});

module.exports = model('Family', FamilySchema, 'families');
