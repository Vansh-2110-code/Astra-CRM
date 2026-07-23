const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('auditLogs'), auditController.getAuditLogs);

module.exports = router;
