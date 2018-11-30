const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../../middlewares/request-handler/validator');

const schemas = {
    login: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            fcm_token: Joi.string().required()
        }).required()
    }),
    register: Joi.object({
        body: Joi.object({
            fullname: Joi.string().min(4).max(50).required(),
            username: Joi.string().min(4).max(20).required(),
            email: Joi.string().max(50).required(),
            password: Joi.string().min(5).max(16).required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().min(7).max(20).required(),
            fcm_token: Joi.string().required()
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
                fullname: Joi.string().min(4).max(50).required()
            }).required(),
            fcm_token: Joi.string().required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
