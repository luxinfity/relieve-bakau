'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const { create, list, detail } = require('../methods/addresses');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.post('/', Validator('createAddress'), Logic(create));
router.get('/', Logic(list));
router.get('/:id', Logic(detail));

module.exports = router;
