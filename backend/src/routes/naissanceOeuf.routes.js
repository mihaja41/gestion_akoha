const express = require('express');
const router = express.Router();
const naissanceOeufController = require('../controllers/naissanceOeuf.controller');

router.get('/', naissanceOeufController.getAll);
router.get('/:id', naissanceOeufController.getById);
router.post('/', naissanceOeufController.create);
router.put('/:id', naissanceOeufController.update);
router.delete('/:id', naissanceOeufController.deleteById);

module.exports = router;
