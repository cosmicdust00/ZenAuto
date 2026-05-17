const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middlewares/upload');
const { authorizeToken } = require('../middlewares/auth');

router.post('/car-image', authorizeToken, uploadMiddleware.single('image'), uploadController.uploadCarImage);

module.exports = router;