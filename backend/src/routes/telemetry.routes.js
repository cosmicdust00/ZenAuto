const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetry.controller');

router.post('/locations', telemetryController.saveLocation);
router.get('/locations/:car_id', telemetryController.getLatestLocation);
router.get('/history/:car_id', telemetryController.getTrajectoryHistory);

module.exports = router;