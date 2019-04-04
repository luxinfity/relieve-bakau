
const bcrypt = require('bcryptjs');
const moment = require('moment');

const normalizeName = (payload) => {
    let name;
    if (payload.name) {
        name = payload.name;
    } else if (payload.given_name) {
        name = `${payload.given_name} ${payload.family_name}`;
    } else {
        name = null;
    }

    return name;
};

exports.create = (payload, { is_complete: isComplete } = { is_complete: true }) => ({
    ...payload,
    phone: payload.phone ? payload.phone : null, // set as primary phone
    password: payload.password || null,
    birthdate: payload.birthdate ? moment(payload.birthdate).format('YYYY-MM-DD') : null,
    is_complete: isComplete,
    fcm_token: null
});

exports.googleCallback = payload => ({
    email: payload.email,
    fullname: normalizeName(payload)
});

exports.completeRegister = payload => ({
    ...payload,
    phone: payload.phone,
    password: bcrypt.hashSync(payload.password, 8),
    birthdate: moment(payload.birthdate).format('YYYY-MM-DD'),
    is_complete: true
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
