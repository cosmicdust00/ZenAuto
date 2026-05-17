const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');

router.get('/', faqController.getApprovedFaqs);
router.post('/inquiry', faqController.submitInquiry);
router.put('/publish/:id', faqController.publishFaq);

module.exports = router;