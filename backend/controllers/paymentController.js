const { razorpayInstance, RAZORPAY_KEY_SECRET } = require('../config/razorpay');
const TenantService = require('../services/TenantService');
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Order amount is required.' });
    }

    const options = {
      amount: Math.round(parseFloat(amount) * 100), // amount in lowest currency unit (paise/cents)
      currency: currency || 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error('Razorpay order creation failure:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tenantId, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !tenantId || !plan) {
      return res.status(400).json({ error: 'Missing mandatory transaction signatures.' });
    }

    // Verify HMAC signature integrity
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Complete subscription upgrade in the database
      const tenant = await TenantService.upgradeTenant(tenantId, plan);
      res.json({ success: true, message: 'Payment verified and plan upgraded.', tenant });
    } else {
      res.status(400).json({ error: 'Cryptographic signature mismatch. Transaction untrusted.' });
    }
  } catch (error) {
    console.error('Razorpay verification failure:', error);
    res.status(500).json({ error: error.message });
  }
};
