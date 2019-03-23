'use strict';

const { HttpError } = require('node-common');
const JWT = require('../utils/libs/jwt');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw HttpError.NotAuthorized('Token Not Provided');
        try {
            req.auth = await JWT.verify(token);
        } catch (err) {
            const message = err.message === 'jwt expired' ? 'Token Expired' : 'Invalid Token';
            throw HttpError.NotAuthorized(message);
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
