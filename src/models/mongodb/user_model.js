const { HttpError } = require('relieve-common');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const Jwt = require('../../utils/libs/jwt');

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

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
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    fullname: {
        type: String
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
    img_url: {
        type: String
    },
    birthdate: {
        type: Date
    },
    phone: {
        type: String
    },
    gender: {
        type: String,
        enum: ['m', 'f']
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
}, options);

const createTokens = async (user) => {
    const token = await Jwt.create({ uid: user.id });
    const refresh = await Jwt.generateRefreshToken();
    return {
        token,
        refresh
    };
};

UserSchema.method({
    async sign() {
        const { token, refresh } = await createTokens(this);
        await this.updateOne({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    },
    async signIn(password) {
        if (!bcrypt.compareSync(password, this.password)) throw HttpError.NotAuthorized('Credentials not match');
        const { token, refresh } = await createTokens(this);
        await this.updateOne({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    },
    signByRefresh() {
        if (moment() > moment(this.refresh_token.expired_at)) throw HttpError.NotAuthorized('refresh token expired');
        return Jwt.create({ uid: this.id });
    }
});

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') && user.password) user.password = bcrypt.hashSync(user.password, 10);
    return next();
});

module.exports = model('User', UserSchema, 'users');
