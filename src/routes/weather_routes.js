const router = require('express').Router();
const WeatherController = require('../controllers/weather_controller');
const WeatherRequest = require('../middlewares/request-validator/weather_request');
const JWTAuth = require('../middlewares/request-handler/jwt_auth');

router.get('/', JWTAuth, WeatherRequest('list'), WeatherController.list);
router.post('/auth', WeatherController.auth);

module.exports = router;
