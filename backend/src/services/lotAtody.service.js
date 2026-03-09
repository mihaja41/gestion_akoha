const lotAtodyRepository = require('../repositories/lotAtody.repository');

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

module.exports = { getAll, getById, create, update, deleteById };
