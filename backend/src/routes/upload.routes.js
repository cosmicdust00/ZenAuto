const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middlewares/upload');

router.post('/car-image', uploadMiddleware.single('image'), uploadController.uploadCarImage);

module.exports = router;