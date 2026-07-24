const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { checkFeature } = require('../middleware/planMiddleware');
const { routeCache } = require('../middleware/cacheMiddleware');

router.get('/', checkFeature('leads'), routeCache('leads'), leadController.getLeads);
router.post('/', checkFeature('leads'), leadController.createLead);
router.put('/:id', checkFeature('leads'), leadController.updateLead);
router.delete('/:id', checkFeature('leads'), leadController.deleteLead);

module.exports = router;
