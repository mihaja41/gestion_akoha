const lotAkohoRepository = require('../repositories/lotAkoho.repository');

async function getAll() {
    return await lotAkohoRepository.findAll();
}

async function getById(id) {
    const item = await lotAkohoRepository.findById(id);
    if (!item) {
        const error = new Error(`LotAkoho avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (data.numero == null || data.date_entree == null || data.nombre == null ||
        data.age == null || data.prix_achat == null || data.Id_race == null) {
        const error = new Error('Champs obligatoires : numero, date_entree, nombre, age, prix_achat, Id_race');
        error.status = 400;
        throw error;
    }
    return await lotAkohoRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await lotAkohoRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de LotAkoho id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await lotAkohoRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de LotAkoho id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

module.exports = { getAll, getById, create, update, deleteById };