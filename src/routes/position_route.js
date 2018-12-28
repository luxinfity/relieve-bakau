const router = require('express').Router();
const PositionController = require('../controllers/position_controller');
const PositionRequest = require('../middlewares/request-validator/position_request');

router.post('/', PositionRequest('create'), PositionController.create);

module.exports = router;
