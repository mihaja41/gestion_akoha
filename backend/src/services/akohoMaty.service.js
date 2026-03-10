const akohoMatyRepository = require('../repositories/akohoMaty.repository');

async function getAll() {
    return await akohoMatyRepository.findAll();
}

async function getById(id) {
    const item = await akohoMatyRepository.findById(id);
    if (!item) {
        const error = new Error(`AkohoMaty avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (data.date_mort == null || data.nombre == null || data.Id_lot_akoho == null) {
        const error = new Error('Champs obligatoires : date_mort, nombre, Id_lot_akoho');
        error.status = 400;
        throw error;
    }
    return await akohoMatyRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await akohoMatyRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de AkohoMaty id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await akohoMatyRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de AkohoMaty id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

async function getAkohoMatyByIdLotAkohoAndDate(idLotAkoho, date) {
    return await akohoMatyRepository.getAkohoMatyByIdLotAkohoAndDate(idLotAkoho, date);
}

module.exports = { getAll, getById, create, update, deleteById, getAkohoMatyByIdLotAkohoAndDate };