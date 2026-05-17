const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetry.controller');
const { authorizeToken } = require('../middlewares/auth');

router.post('/locations', telemetryController.saveLocation);
router.get('/locations/:car_id', authorizeToken, telemetryController.getLatestLocation);
router.get('/history/:car_id', authorizeToken, telemetryController.getTrajectoryHistory);

module.exports = router;