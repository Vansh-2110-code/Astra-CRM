const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.get('/', salaryController.getSlips);
router.post('/', salaryController.generateSlip);
router.put('/:id/paid', salaryController.markPaid);

module.exports = router;
