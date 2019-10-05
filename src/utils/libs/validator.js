'use strict';

const BaseJoi = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const { HttpError } = require('relieve-common');

const Joi = BaseJoi.extend(JoiDate);

const COOR_REGEX = /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/; // eslint-disable-line

const ADDRESS = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    coordinates: Joi.string().regex(COOR_REGEX).required()
}).required();

const schemas = {
    login: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }).required()
    }),
    register: Joi.object({
        body: Joi.object({
            username: Joi.string().min(4).max(50).required(),
            password: Joi.string().min(5).max(20).required(),
            email: Joi.string().email().required(),
            fullname: Joi.string().min(4).max(50).required(),
            gender: Joi.string().valid('m', 'f').required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().regex(PHONE_REGEX).required(),
            address: ADDRESS
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
        body: ADDRESS
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
            id: Joi.string().required()
        }).required()
    }),
    verifyRequest: Joi.object({
        body: Joi.object({
            request_id: Joi.string().required(),
            code: Joi.string().required()
        }).required()
    }),
    updateRequest: Joi.object({
        params: Joi.object({
            id: Joi.string().required()
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
            fullname: Joi.string().min(4).max(50).required(),
            username: Joi.string().min(4).max(50).required(),
            password: Joi.string().min(5).max(20).required(),
            birthdate: Joi.date().format('YYYY-MM-DD').required(),
            phone: Joi.string().regex(PHONE_REGEX).required(),
            gender: Joi.string().valid('m', 'f').required(),
            address: ADDRESS
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
    }),
    ping: Joi.object({
        body: Joi.object({
            ping_type: Joi.string().valid('FAMILY_CONDITION', 'CHAT').required(),
            payload: Joi.any().optional().default(null)
        }).required(),
        params: Joi.object({
            id: Joi.string().required()
        }).required()
    }),
    searchFamily: Joi.object({
        params: Joi.object({
            search: Joi.string().required()
        }).required()
    }),
    updateProfile: Joi.object({
        body: Joi.object({
            username: Joi.string().min(4).max(50).optional(),
            fullname: Joi.string().min(4).max(50).optional(),
            gender: Joi.string().valid('m', 'f').optional(),
            birthdate: Joi.date().format('YYYY-MM-DD').optional(),
            phone: Joi.string().regex(PHONE_REGEX).optional()
        }).required()
    }),
    updatePassword: Joi.object({
        body: Joi.object({
            old_password: Joi.string().required(),
            new_password: Joi.string().min(4).max(30).required(),
            confirm_password: Joi.string().required()
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
