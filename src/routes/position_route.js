'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const { create } = require('../controllers/positions');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.post('/', Validator('createPosition'), Logic(create));

module.exports = router;
