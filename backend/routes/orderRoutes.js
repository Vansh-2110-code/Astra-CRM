const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('orders'), orderController.getOrders);
router.post('/', checkFeature('orders'), orderController.createOrder);
router.put('/:id', checkFeature('orders'), orderController.updateOrder);
router.delete('/:id', checkFeature('orders'), orderController.deleteOrder);

module.exports = router;
