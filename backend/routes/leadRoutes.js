const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('leads'), leadController.getLeads);
router.post('/', checkFeature('leads'), leadController.createLead);

module.exports = router;
