const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../../middlewares/request-handler/validator');

const schemas = {
    login: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }).required()
    }),
    register: Joi.object({
        body: Joi.object({
            fullname: Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().required()
        }).required()
    }),
    completeRegistration: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().required()
        }).required()
    }),
    refresh: Joi.object({
        body: Joi.object({
            refresh_token: Joi.string().required()
        }).required()
    }),
    google: Joi.object({
        body: Joi.object({
            idToken: Joi.string().required(),
            profile: Joi.object({
                fullname: Joi.string().required()
            }).required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
