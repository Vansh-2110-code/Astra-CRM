const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('tickets'), supportController.getTickets);
router.post('/', checkFeature('tickets'), supportController.createTicket);

module.exports = router;
