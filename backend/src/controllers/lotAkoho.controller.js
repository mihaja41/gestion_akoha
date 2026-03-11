const lotAkohoService = require('../services/lotAkoho.service');

async function getAll(req, res, next) {
    try {
        res.json(await lotAkohoService.getAll());
    } catch (error) { next(error); }
}

async function getById(req, res, next) {
    try {
        res.json(await lotAkohoService.getById(parseInt(req.params.id)));
    } catch (error) { next(error); }
}

async function getByNumero(req, res, next) {
    try {
        res.json(await lotAkohoService.getByNumero(parseInt(req.params.numero)));
    } catch (error) { next(error); }
}

async function create(req, res, next) {
    try {
        res.status(201).json(await lotAkohoService.create(req.body));
    } catch (error) { next(error); }
}

async function update(req, res, next) {
    try {
        res.json(await lotAkohoService.update(parseInt(req.params.id), req.body));
    } catch (error) { next(error); }
}

async function deleteById(req, res, next) {
    try {
        await lotAkohoService.deleteById(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) { next(error); }
}

async function getSituation(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const date = req.query.date;
        if (!date) {
            const error = new Error('Le paramètre "date" est obligatoire (format: YYYY-MM-DD)');
            error.status = 400;
            throw error;
        }
        res.json(await lotAkohoService.getSituationByIdAndDate(id, date));
    } catch (error) { next(error); }
}

module.exports = { getAll, getById, getByNumero, create, update, deleteById, getSituation };