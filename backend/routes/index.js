const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');

const { authenticateToken } = require('../middleware/authMiddleware');

const authRoutes = require('./authRoutes');
const leadRoutes = require('./leadRoutes');
const dealRoutes = require('./dealRoutes');
const quoteRoutes = require('./quoteRoutes');
const orderRoutes = require('./orderRoutes');
const supportRoutes = require('./supportRoutes');
const integrationRoutes = require('./integrationRoutes');
const employeeRoutes = require('./employeeRoutes');
const roleRoutes = require('./roleRoutes');
const auditRoutes = require('./auditRoutes');
const tenantRoutes = require('./tenantRoutes');
const paymentRoutes = require('./paymentRoutes');
const salaryRoutes = require('./salaryRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const metaAdsRoutes = require('./metaAdsRoutes');

// Swagger Documentation Page Route
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Open / public routes
router.use('/auth', authRoutes);
router.use('/integrations/meta-ads', metaAdsRoutes);

// Protected routes (require token authentication & tenant context injection)
router.use('/leads', authenticateToken, leadRoutes);
router.use('/deals', authenticateToken, dealRoutes);
router.use('/quotes', authenticateToken, quoteRoutes);
router.use('/orders', authenticateToken, orderRoutes);
router.use('/support', authenticateToken, supportRoutes);
router.use('/integrations', authenticateToken, integrationRoutes);
router.use('/employees', authenticateToken, employeeRoutes);
router.use('/roles', authenticateToken, roleRoutes);
router.use('/audit-logs', authenticateToken, auditRoutes);
router.use('/tenants', authenticateToken, tenantRoutes);
router.use('/payments', authenticateToken, paymentRoutes);
router.use('/salary', authenticateToken, salaryRoutes);
router.use('/attendance', authenticateToken, attendanceRoutes);

module.exports = router;
