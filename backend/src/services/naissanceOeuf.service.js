const naissanceOeufRepository = require('../repositories/naissanceOeuf.repository');

async function getAll() {
    return await naissanceOeufRepository.findAll();
}

async function getById(id) {
    const item = await naissanceOeufRepository.findById(id);
    if (!item) {
        const error = new Error(`NaissanceOeuf avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (!data.nombre_poussin || data.date_naissance == null || data.Id_lot_atody == null) {
        const error = new Error('Champs obligatoires : nombre_poussin, date_naissance, Id_lot_atody');
        error.status = 400;
        throw error;
    }
    return await naissanceOeufRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await naissanceOeufRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de NaissanceOeuf id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await naissanceOeufRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de NaissanceOeuf id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

/**
 * Calculer le nombre total de poussins nés pour des lots d'oeufs donnés, jusqu'à une date.
 */
async function getNombreNaissanceByLotAtodyIdsAndDate(lotAtodyIds, date) {
    return await naissanceOeufRepository.sumNaissanceByLotAtodyIdsAndDate(lotAtodyIds, date);
}

module.exports = { getAll, getById, create, update, deleteById, getNombreNaissanceByLotAtodyIdsAndDate };
