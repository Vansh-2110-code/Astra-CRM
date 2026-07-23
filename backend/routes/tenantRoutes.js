const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('tenants'), tenantController.getTenants);
router.post('/', checkFeature('tenants'), tenantController.createTenant);

module.exports = router;
