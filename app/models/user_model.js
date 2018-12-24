const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const Jwt = require('../utils/jwt');

const ContactSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [10, 20, 30],
        default: 10,
        required: true
    }
}, { versionKey: false, _id: false });

const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expired_at: {
        type: Date,
        required: true
    }
}, { versionKey: false, _id: false });

const UserSchema = new Schema({
    uuid: {
        type: String,
        default: uuid.v4()
    },
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    birthdate: {
        type: Date
    },
    phones: {
        type: [ContactSchema]
    },
    gender: {
        type: String,
        enum: ['m', 'f'],
        required: true
    },
    is_complete: {
        type: Boolean,
        required: true
    },
    fcm_token: {
        type: String
    },
    refresh_token: {
        type: RefreshTokenSchema
    }
}, { versionKey: false });

UserSchema.method({
    async signIn() {
        const token = await Jwt.create({ uid: this.uuid });
        const refresh = await Jwt.generateRefreshToken();
        await this.update({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    }
});

module.exports = model('User', UserSchema, 'users');
