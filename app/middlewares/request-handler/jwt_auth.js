const JWT = require('../../utils/jwt');
const HttpException = require('../../utils/http_exception');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw HttpException.Unauthorized('Token Not Provided');
        try {
            req.auth = await JWT.verify(token);
        } catch (err) {
            const message = err.message === 'jwt expired' ? 'Token Expired' : 'Invalid Token';
            throw HttpException.Unauthorized(message);
        }
        return next();
    } catch (err) {
        if (err.status) return next(err);
        return next(HttpException.InternalServerError(err.message));
    }
};
