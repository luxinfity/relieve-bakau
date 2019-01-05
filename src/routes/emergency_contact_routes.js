const router = require('express').Router();
const EmergencyContactController = require('../controllers/emergency_contact_controller');

router.get('/discover', EmergencyContactController.discover);
router.get('/discover/:id', EmergencyContactController.discoverDetail);

module.exports = router;
