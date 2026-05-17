const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authorizeToken } = require('../middlewares/auth');

router.use(authorizeToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;