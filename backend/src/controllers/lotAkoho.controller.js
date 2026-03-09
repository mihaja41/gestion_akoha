const lotAkohoService = require('../services/lotAkoho.service');

async function create(req, res, next) {
    try {
        const data = await lotAkohoService.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create
}