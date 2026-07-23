const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('deals'), dealController.getDeals);
router.post('/', checkFeature('deals'), dealController.createDeal);

module.exports = router;
