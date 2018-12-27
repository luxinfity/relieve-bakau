const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../request-handler/validator');

const schemas = {
    completeRegistration: Joi.object({
        body: Joi.object({
            username: Joi.string().min(4).max(20).required(),
            password: Joi.string().min(5).max(16).required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().min(7).max(20).required(),
            gender: Joi.string().valid('m', 'f').required()
        }).required()
    }),
    updatePosition: Joi.object({
        body: Joi.object({
            coordinates: Joi.string().required(),
            status: Joi.number().integer().valid(10, 20, 30).required()
        }).required()
    }),
    updateFcmToken: Joi.object({
        body: Joi.object({
            fcm_token: Joi.string().required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
