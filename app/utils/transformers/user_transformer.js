
const bcrypt = require('bcryptjs');
const moment = require('moment');
const uuid = require('uuid');

exports.create = (payload, { is_complete } = { is_complete: true }) => ({
    uuid: uuid(),
    ...payload,
    password: payload.password ? bcrypt.hashSync(payload.password, 8) : undefined,
    birthdate: payload.birthdate ? moment(payload.birthdate).format('YYYY-MM-DD') : undefined,
    families: [],
    is_complete
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
