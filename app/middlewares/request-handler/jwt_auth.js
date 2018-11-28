const JWT = require('../../utils/jwt');
const { exception } = require('../../utils/helpers');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return next(exception('Token Not Provided', 401));
    try {
        req.auth = await JWT.verify(token);
    } catch (err) {
        const message = err.message === 'jwt expired' ? 'Token Expired' : 'Invalid Token';
        return next(exception(message, 401));
    }
    return next();
};
