const raceRepository = require('../repositories/race.repository');

async function getAll() {
    return await raceRepository.findAll();
}

async function getById(id) {
    const item = await raceRepository.findById(id);
    if (!item) {
        const error = new Error(`Race avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (!data.nom || data.prix_sakafo == null || data.prix_vente == null || data.prix_vente_atody == null) {
        const error = new Error('Champs obligatoires : nom, prix_sakafo, prix_vente, prix_vente_atody');
        error.status = 400;
        throw error;
    }
    return await raceRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await raceRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de Race id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await raceRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de Race id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

module.exports = { getAll, getById, create, update, deleteById };
