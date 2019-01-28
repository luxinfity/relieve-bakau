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
            username: Joi.string().min(4).max(20).required(),
            password: Joi.string().min(5).max(16).required(),
            email: Joi.string().max(50).required(),
            fullname: Joi.string().min(4).max(50).required(),
            gender: Joi.string().valid('m', 'f').required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().min(7).max(20).required()
        }).required()
    }),
    refresh: Joi.object({
        body: Joi.object({
            refresh_token: Joi.string().required()
        }).required()
    }),
    google: Joi.object({
        body: Joi.object({
            idToken: Joi.string().required()
        }).required()
    }),
    check: Joi.object({
        body: Joi.object({
            param: Joi.string().valid('username', 'email').required(),
            value: Joi.string().required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
