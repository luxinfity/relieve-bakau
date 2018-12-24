const router = require('express').Router();
const AuthController = require('../controllers/auth_controller');
const AuthRequest = require('../middlewares/request-validator/auth_request');

router.get('/', (req, res) => res.json({ message: 'bakau running' }));

router.post('/register', AuthRequest('register'), AuthController.register);
router.post('/login', AuthRequest('login'), AuthController.login);
router.post('/refresh', AuthRequest('refresh'), AuthController.refresh);
router.post('/google/callback', AuthRequest('google'), AuthController.googleCallback);

module.exports = router;
