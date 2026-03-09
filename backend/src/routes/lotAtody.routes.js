const express = require('express');
const router = express.Router();
const lotAtodyController = require('../controllers/lotAtody.controller');

router.get('/', lotAtodyController.getAll);
router.get('/:id', lotAtodyController.getById);
router.post('/', lotAtodyController.create);
router.put('/:id', lotAtodyController.update);
router.delete('/:id', lotAtodyController.deleteById);

module.exports = router;
