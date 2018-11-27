const router = require('express').Router();
const AuthController = require('../controllers/auth_controller');
const AuthRequest = require('../middlewares/request-validator/auth_request');
const JWTAUTH = require('../middlewares/request-handler/jwt_auth');

router.post('/register', AuthRequest('register'), AuthController.register);
router.post('/register/complete', JWTAUTH, AuthRequest('completeRegistration'), AuthController.completeRegister);
router.post('/login', AuthRequest('login'), AuthController.login);
router.post('/refresh', AuthRequest('refresh'), AuthController.refresh);
router.post('/google/callback', AuthRequest('google'), AuthController.googleCallback);

module.exports = router;
