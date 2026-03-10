/**
 * Service AtodyLamokany — couche de logique métier.
 * 
 * ➜ Spring Boot : équivalent d'une classe @Service
 *
 * Gère la logique métier pour les œufs couvés gâtés (pourris).
 */

const atodyLamokanyRepository = require('../repositories/atodyLamokany.repository');

async function getAll() {
    return await atodyLamokanyRepository.findAll();
}

async function getById(id) {
    const item = await atodyLamokanyRepository.findById(id);
    if (!item) {
        const error = new Error(`AtodyLamokany avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return item;
}

async function create(data) {
    if (data.date_lamokany == null || data.nombre == null || data.Id_lot_atody == null) {
        const error = new Error('Champs obligatoires : date_lamokany, nombre, Id_lot_atody');
        error.status = 400;
        throw error;
    }
    return await atodyLamokanyRepository.create(data);
}

async function update(id, data) {
    await getById(id);
    const updated = await atodyLamokanyRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de AtodyLamokany id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

async function deleteById(id) {
    await getById(id);
    const deleted = await atodyLamokanyRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de AtodyLamokany id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

/**
 * Calculer le nombre total d'œufs pourris pour des lots d'œufs donnés, jusqu'à une date.
 */
async function getNombreLamokanyByLotAtodyIdsAndDate(lotAtodyIds, date) {
    return await atodyLamokanyRepository.sumLamokanyByLotAtodyIdsAndDate(lotAtodyIds, date);
}

module.exports = { getAll, getById, create, update, deleteById, getNombreLamokanyByLotAtodyIdsAndDate };
