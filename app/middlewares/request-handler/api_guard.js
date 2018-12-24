const config = require('../../config/app');
const HttpException = require('../../utils/http_exception');

module.exports = (req, res, next) => {
    if (req.query.secret !== config.apiKey && req.headers.secret !== config.apiKey) {
        return next(HttpException.Unauthorized('Not Authorized'));
    }
    return next();
};
