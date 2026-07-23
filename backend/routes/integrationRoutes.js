const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('integrations'), integrationController.getIntegrations);
router.post('/', checkFeature('integrations'), integrationController.updateIntegration);

module.exports = router;
