'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const {
    list, requestList, createRequest, verifyRequest, update, ping
} = require('../methods/families');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.get('/', Logic(list));
router.get('/request', Logic(requestList));
router.post('/request', Validator('createRequest'), Logic(createRequest));
router.post('/request/verify', Validator('verifyRequest'), Logic(verifyRequest));
router.put('/:id/update', Validator('updateRequest'), Logic(update));
router.post('/:id/ping', Validator('ping'), Logic(ping));

module.exports = router;
