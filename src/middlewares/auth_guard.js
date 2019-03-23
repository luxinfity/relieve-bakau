'use strict';

const { HttpError } = require('node-common');
const JWT = require('../utils/libs/jwt');
const parseDataObject = require('../utils/helpers').parseDataObject;

const generateContext = async payload => parseDataObject({ id: payload.uid });

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw HttpError.NotAuthorized('token not provided');
        try {
            const payload = await JWT.verify(token);
            req.auth = await generateContext(payload);
        } catch (err) {
            const message = err.message === 'jwt expired' ? 'token expired' : 'invalid token';
            throw HttpError.NotAuthorized(message);
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
