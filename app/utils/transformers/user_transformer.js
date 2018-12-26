
const bcrypt = require('bcryptjs');
const moment = require('moment');
const uuid = require('uuid');

const normalizeName = (payload) => {
    let name;
    if (payload.name) {
        name = payload.name;
    } else {
        name = `${payload.given_name} ${payload.family_name}`;
    }

    return name;
};

exports.create = (payload, { is_complete: isComplete } = { is_complete: true }) => ({
    uuid: uuid(),
    ...payload,
    phones: payload.phone ? [{ number: payload.phone, status: 10 }] : [], // set as primary phone
    password: payload.password ? bcrypt.hashSync(payload.password, 8) : undefined,
    birthdate: payload.birthdate ? moment(payload.birthdate).format('YYYY-MM-DD') : undefined,
    is_complete: isComplete,
    fcm_token: null
});

exports.googleCallback = payload => ({
    email: payload.email,
    fullname: normalizeName(payload)
});

exports.profile = user => ({
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    phone: user.phone,
    birthdate: user.birthdate,
    is_complete: user.is_complete,
    gender: user.gender
});

module.exports = exports;
