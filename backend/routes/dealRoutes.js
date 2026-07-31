const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { checkFeature } = require('../middleware/planMiddleware');
const { routeCache } = require('../middleware/cacheMiddleware');

router.get('/', checkFeature('deals'), routeCache('deals'), dealController.getDeals);
router.post('/', checkFeature('deals'), dealController.createDeal);
router.put('/:id', checkFeature('deals'), dealController.updateDeal);

module.exports = router;
