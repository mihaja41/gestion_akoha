const lotAtodyRepository = require('../repositories/lotAtody.repository');
const naissanceOeufService = require('./naissanceOeuf.service');
const atodyLamokanyService = require('./atodyLamokany.service');

async function getAll() {
    return await lotAtodyRepository.findAll();
}

async function getById(id) {
    const item = await lotAtodyRepository.findById(id);
    if (!item) {
        const error = new Error(`LotAtody avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (data.numero == null || data.date_entree == null || data.nombre == null || data.Id_lot_akoho == null) {
        const error = new Error('Champs obligatoires : numero, date_entree, nombre, Id_lot_akoho');
        error.status = 400;
        throw error;
    }
    return await lotAtodyRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await lotAtodyRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de LotAtody id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await lotAtodyRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de LotAtody id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

/**
 * Calculer le nombre d'oeufs restants pour un lot de poulets à une date donnée.
 * Formule : total oeufs - naissances (poussins éclos) - oeufs pourris (lamokany)
 */
async function getNombreOeufsByLotAkohoIdAndDate(idLotAkoho, date) {
    const lotsAtody = await lotAtodyRepository.findByLotAkohoIdAndDate(idLotAkoho, date);
    let totalOeufs = 0;
    const lotAtodyIds = [];
    for (const lot of lotsAtody) {
        totalOeufs += lot.nombre;
        lotAtodyIds.push(lot.Id_lot_atody);
    }
    if (lotAtodyIds.length > 0) {
        const totalNaissances = await naissanceOeufService.getNombreNaissanceByLotAtodyIdsAndDate(lotAtodyIds, date);
        const totalLamokany = await atodyLamokanyService.getNombreLamokanyByLotAtodyIdsAndDate(lotAtodyIds, date);
        totalOeufs -= totalNaissances;
        totalOeufs -= totalLamokany;
    }
    return Math.max(0, totalOeufs);
}

module.exports = { getAll, getById, create, update, deleteById, getNombreOeufsByLotAkohoIdAndDate };
