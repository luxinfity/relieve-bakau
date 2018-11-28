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
    }),
    updateLocation: Joi.object({
        body: Joi.object({
            location: Joi.object({
                type: Joi.string().default('Point').valid('Point'),
                coordinates: Joi.array().items(Joi.number().required()).min(2).max(2)
            }).required(),
            status: Joi.number().integer().required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
