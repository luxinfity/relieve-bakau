'use strict';

const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const { HttpError } = require('node-common');

const Joi = BaseJoi.extend(Extension);

const COOR_REGEX = /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/;

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
    }),
    createAddress: Joi.object({
        body: Joi.object({
            name: Joi.string().min(4).max(25).required(),
            coordinates: Joi.string().regex(COOR_REGEX).required()
        }).required()
    }),
    nearby: Joi.object({
        query: Joi.object({
            radius: Joi.number().integer().positive().required(),
            coordinates: Joi.string().regex(COOR_REGEX).required()
        }).required()
    }),
    address: Joi.object({
        query: Joi.object({
            coordinates: Joi.string().regex(COOR_REGEX).required()
        }).required()
    }),
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
    updateRequest: Joi.object({
        params: Joi.object({
            uuid: Joi.string().required()
        }).required(),
        body: Joi.object({
            nick: Joi.string(),
            role: Joi.string()
        }).required()
    }),
    createPosition: Joi.object({
        body: Joi.object({
            coordinates: Joi.string().regex(COOR_REGEX).required(),
            status: Joi.number().integer().valid(10, 20, 30).required()
        }).required()
    }),
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
            coordinates: Joi.string().regex(COOR_REGEX).required(),
            status: Joi.number().integer().valid(10, 20, 30).required()
        }).required()
    }),
    updateFcmToken: Joi.object({
        body: Joi.object({
            fcm_token: Joi.string().required()
        }).required()
    })
};

const defaultOptions = {
    stripUnknown: {
        arrays: false,
        objects: true
    },
    abortEarly: false
};

module.exports = (input, schema, options = defaultOptions) => Joi.validate(input, schemas[schema], options)
    .catch((err) => {
        const details = err.details.reduce((detail, item) => {
            detail[item.context.key] = item.message.replace(/"/g, '');
            return detail;
        }, {});
        throw HttpError.UnprocessableEntity('validation error', details);
    });