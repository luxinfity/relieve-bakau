const Joi = require('joi');
const { requestInput } = require('../../utils/helpers');
const HttpException = require('../../utils/http_exception');

module.exports = async (req, res, next) => {
    const input = requestInput(req);
    await Joi.validate(input, req.schema, { stripUnknown: true, abortEarly: false })
        .then((validated) => {
            req.query = validated.query;
            req.params = validated.params;
            req.body = validated.body;
            return next();
        })
        .catch((err) => {
            const details = err.details.reduce((detail, item) => {
                detail[item.context.key] = item.message.replace(/"/g, '');
                return detail;
            }, {});
            return next(HttpException.UnprocessableEntity('validation error', details));
        });
};
