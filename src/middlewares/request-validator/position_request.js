const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../request-handler/validator');

const schemas = {
    create: Joi.object({
        body: Joi.object({
            coordinates: Joi.string().required(),
            status: Joi.number().integer().valid(10, 20, 30).required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
