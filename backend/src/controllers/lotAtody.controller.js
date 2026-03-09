const lotAtodyService = require('../services/lotAtody.service');

async function getAll(req, res, next) {
    try {
        res.json(await lotAtodyService.getAll());
    } catch (error) { next(error); }
}

async function getById(req, res, next) {
    try {
        res.json(await lotAtodyService.getById(parseInt(req.params.id)));
    } catch (error) { next(error); }
}

async function create(req, res, next) {
    try {
        res.status(201).json(await lotAtodyService.create(req.body));
    } catch (error) { next(error); }
}

async function update(req, res, next) {
    try {
        res.json(await lotAtodyService.update(parseInt(req.params.id), req.body));
    } catch (error) { next(error); }
}

async function deleteById(req, res, next) {
    try {
        await lotAtodyService.deleteById(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) { next(error); }
}

module.exports = { getAll, getById, create, update, deleteById };
