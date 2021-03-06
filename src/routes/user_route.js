'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const {
    profile, completeProfile, updateProfile, updateFcmToken, updatePassword
} = require('../methods/users');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.get('/profile', Logic(profile));
router.put('/profile', Validator('updateProfile'), Logic(updateProfile));
router.post('/complete-registration', Validator('completeRegistration'), Logic(completeProfile));
router.post('/update-fcm', Validator('updateFcmToken'), Logic(updateFcmToken));
router.post('/update-password', Validator('updatePassword'), Logic(updatePassword));

module.exports = router;
