const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/razorpay/order', paymentController.createOrder);
router.post('/razorpay/verify', paymentController.verifyPayment);

module.exports = router;
