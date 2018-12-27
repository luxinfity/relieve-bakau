const { Schema, model } = require('mongoose');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const Jwt = require('../utils/jwt');
const HttpException = require('../utils/http_exception');

const ContactSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [10, 20],
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
        default: uuid.v4
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
}, { versionKey: false });

const createTokens = async (user) => {
    const token = await Jwt.create({ uid: user.uuid });
    const refresh = await Jwt.generateRefreshToken();
    return {
        token,
        refresh
    };
};

UserSchema.method({
    async sign() {
        const { token, refresh } = await createTokens(this);
        await this.update({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    },
    async signIn(password) {
        if (!bcrypt.compareSync(password, this.password)) throw HttpException.NotAuthorized('Credentials not match');
        const { token, refresh } = await createTokens(this);
        await this.update({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    },
    signByRefresh() {
        if (moment() > moment(this.refresh_token.expired_at)) throw HttpException.NotAuthorized('refresh token expired');
        return Jwt.create({ uid: this.uuid });
    }
});

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) user.password = bcrypt.hashSync(user.password, 10);
    return next();
});

module.exports = model('User', UserSchema, 'users');
