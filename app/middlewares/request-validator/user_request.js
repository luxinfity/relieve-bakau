const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../request-handler/validator');

const schemas = {
    completeRegistration: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
