const express = require('express');
const router = express.Router();
const lotAkohoController = require('../controllers/lotAkoho.controller');

router.get('/', lotAkohoController.getAll);
router.get('/:id', lotAkohoController.getById);
router.post('/', lotAkohoController.create);
router.put('/:id', lotAkohoController.update);
router.delete('/:id', lotAkohoController.deleteById);

module.exports = router;