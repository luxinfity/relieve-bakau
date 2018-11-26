const config = require('../../config/app');
const { exception } = require('../../utils/helpers');

module.exports = (req, res, next) => {
    if (req.query.secret !== config.apiKey && req.headers.secret !== config.apiKey) {
        return next(exception('Not Authorized', 401));
    }
    return next();
};
