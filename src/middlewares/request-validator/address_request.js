const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
const validator = require('../request-handler/validator');

const schemas = {
    create: Joi.object({
        body: Joi.object({
            name: Joi.string().min(4).max(25).required(),
            coordinates: Joi.string().required()
        }).required()
    })
};

module.exports = method => [
    (req, res, next) => {
        req.schema = schemas[method]; next();
    }, validator
];
