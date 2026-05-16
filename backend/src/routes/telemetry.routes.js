const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetry.controller');

router.post('/locations', telemetryController.saveLocation);
router.get('/locations/:car_id', telemetryController.getLatestLocation);

module.exports = router;