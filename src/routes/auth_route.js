'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const {
    register, login, paramCheck, refresh, googleCallback
} = require('../controllers/authentication');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.get('/', Logic(() => ({ message: 'bakau running' })));
router.post('/register', Validator('register'), Logic(register));
router.post('/login', Validator('login'), Logic(login));
router.post('/check', Validator('check'), Logic(paramCheck));
router.post('/refresh', Validator('refresh'), Logic(refresh));
router.post('/google/callback', Validator('google'), Logic(googleCallback));

module.exports = router;
