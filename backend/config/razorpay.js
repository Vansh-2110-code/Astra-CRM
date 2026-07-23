const Razorpay = require('razorpay');

// Standard sandbox credentials for testing subscription flows
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'mockSecretKey2026';

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

module.exports = {
  razorpayInstance,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
};
