const express = require('express');
const router = express.Router();
const metaAdsController = require('../controllers/metaAdsController');

// Public Webhook routes accessed by Meta Graph API servers (No JWT required)
router.get('/webhook', metaAdsController.verifyWebhook);
router.post('/webhook', metaAdsController.receiveWebhookLead);

// Lead Intake & Configuration routes (Used by CRM application)
router.post('/leadgen', metaAdsController.intakeDirectLead);
router.get('/config', metaAdsController.getMetaConfig);
router.post('/config', metaAdsController.updateMetaConfig);

module.exports = router;
