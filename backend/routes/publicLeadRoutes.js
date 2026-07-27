// backend/routes/publicLeadRoutes.js
// Public endpoint for creating leads from external forms.
// It uses the validatePublicKey middleware to protect the route.

const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validatePublicKey } = require('../middleware/publicKey');

// Only POST is needed for creating a lead via public API.
router.post('/', validatePublicKey, leadController.createLead);

module.exports = router;
