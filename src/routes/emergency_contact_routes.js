const router = require('express').Router();
const EmergencyContactController = require('../controllers/emergency_contact_controller');

router.get('/:uuid', EmergencyContactController.list);

module.exports = router;
