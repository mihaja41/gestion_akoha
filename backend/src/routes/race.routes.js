const express = require('express');
const router = express.Router();
const raceController = require('../controllers/race.controller');

router.get('/', raceController.getAll);
router.get('/:id', raceController.getById);
router.post('/', raceController.create);
router.put('/:id', raceController.update);
router.delete('/:id', raceController.deleteById);

module.exports = router;
