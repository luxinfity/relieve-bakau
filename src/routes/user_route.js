'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const { profile, completeRegister, updateFcmToken } = require('../controllers/users');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.get('/profile', Logic(profile));
router.post('/complete-registration', Validator('completeRegistration'), Logic(completeRegister));
router.post('/update-fcm', Validator('updateFcmToken'), Logic(updateFcmToken));

module.exports = router;
