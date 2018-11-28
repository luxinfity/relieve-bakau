
const bcrypt = require('bcryptjs');
const moment = require('moment');
const uuid = require('uuid');

exports.create = (payload, { isComplete } = { isComplete: true }) => ({
    uuid: uuid(),
    ...payload,
    password: payload.password ? bcrypt.hashSync(payload.password, 8) : undefined,
    birthdate: payload.birthdate ? moment(payload.birthdate).format('YYYY-MM-DD') : undefined,
    isComplete
});

module.exports = exports;
