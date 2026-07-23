const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('quotes'), quoteController.getQuotes);
router.post('/', checkFeature('quotes'), quoteController.createQuote);

module.exports = router;
