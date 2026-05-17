const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const { authorizeToken } = require('../middlewares/auth');

router.get('/', faqController.getApprovedFaqs);
router.post('/inquiry', faqController.submitInquiry);
router.put('/publish/:id', authorizeToken, faqController.publishFaq);

module.exports = router;