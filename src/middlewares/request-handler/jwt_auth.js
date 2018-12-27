const JWT = require('../../utils/jwt');
const HttpException = require('../../utils/http_exception');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw HttpException.NotAuthorized('Token Not Provided');
        try {
            req.auth = await JWT.verify(token);
        } catch (err) {
            const message = err.message === 'jwt expired' ? 'Token Expired' : 'Invalid Token';
            throw HttpException.NotAuthorized(message);
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
