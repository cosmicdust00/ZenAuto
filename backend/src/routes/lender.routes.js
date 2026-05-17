const express = require('express');
const router = express.Router();
const lenderController = require('../controllers/lender.controller');
const { authorizeToken } = require('../middlewares/auth');

router.use(authorizeToken);

router.get('/car-models', lenderController.getCarModels);
router.post('/fleets', lenderController.addFleetCar);
router.put('/fleets/:car_id/withdraw', lenderController.withdrawFleetCar);
router.post('/maintenances', lenderController.startMaintenance);
router.put('/maintenances/:maintenance_id/complete', lenderController.completeMaintenance);
router.get('/fleets', lenderController.getLenderFleets);
router.get('/dashboard', lenderController.getLenderDashboard);
router.get('/maintenance', lenderController.getLenderMaintenance);
router.get('/finances', lenderController.getLenderFinances);
router.get('/penalties', lenderController.getLenderPenalties);

module.exports = router;