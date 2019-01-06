const router = require('express').Router();
const UserController = require('../controllers/user_controller');
const ProfileRequest = require('../middlewares/request-validator/user_request');

router.get('/profile', UserController.profile);
router.post('/complete-registration', ProfileRequest('completeRegistration'), UserController.completeRegister);
router.post('/update-fcm', ProfileRequest('updateFcmToken'), UserController.updateFcmToken);

module.exports = router;
