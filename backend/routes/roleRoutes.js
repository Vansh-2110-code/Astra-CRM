const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { checkFeature } = require('../middleware/planMiddleware');

router.put('/:id', checkFeature('roles'), roleController.updateRole);

module.exports = router;
