const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrower.controller');

router.get('/cars/available', borrowerController.getAvailableCars);
router.post('/reservations', borrowerController.createReservation);
router.post('/payments', borrowerController.processPayment);
router.post('/returns/:rental_detail_id', borrowerController.returnCar);
router.get('/reservations', borrowerController.getBorrowerReservations);
router.get('/penalties', borrowerController.getBorrowerPenalties);

module.exports = router;