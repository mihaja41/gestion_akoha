const express = require('express');
const router = express.Router();
const akohoMatyController = require('../controllers/akohoMaty.controller');

router.get('/', akohoMatyController.getAll);
router.get('/:id', akohoMatyController.getById);
router.post('/', akohoMatyController.create);
router.put('/:id', akohoMatyController.update);
router.delete('/:id', akohoMatyController.deleteById);

module.exports = router;
