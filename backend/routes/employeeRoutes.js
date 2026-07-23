const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { checkFeature } = require('../middleware/planMiddleware');

router.get('/', checkFeature('employees'), employeeController.getEmployees);
router.post('/', checkFeature('employees'), employeeController.createEmployee);
router.put('/:id', checkFeature('employees'), employeeController.updateEmployee);

module.exports = router;
