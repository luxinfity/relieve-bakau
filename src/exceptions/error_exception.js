const config = require('../config/app');
const HttpException = require('../utils/http_exception');

module.exports = (err, req, res, next) => {
    const errorInstance = err.status ? err : HttpException.InternalServerError(err.message);
    const {
        status = 500,
        user_message: userMessage = 'something went wrong',
        message_detail: messageDetail
    } = errorInstance;

    let stack = err.stack;
    stack = stack && config.debug ? err.stack.split('\n').map(item => item.trim()) : undefined;

    return res.status(status).json({
        status,
        message: userMessage,
        detail: messageDetail,
        stack
    });
};
