const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('orders'), orderController.getOrders);
router.post('/', checkFeature('orders'), orderController.createOrder);

module.exports = router;
