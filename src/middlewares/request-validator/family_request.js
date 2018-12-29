const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../request-handler/validator');

const schemas = {
    createRequest: Joi.object({
        body: Joi.object({
            username: Joi.string().max(20).required()
        }).required()
    }),
    verifyRequest: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            code: Joi.string().required()
        }).required()
    }),
    update: Joi.object({
        params: Joi.object({
            uuid: Joi.string().required()
        }).required(),
        body: Joi.object({
            nick: Joi.string(),
            role: Joi.string()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
