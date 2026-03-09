const express = require('express');
const router = express.Router();
const lotAkohoController = require('../controllers/lotAkoho.controller');

router.post('/', lotAkohoController.create);

module.exports = router;