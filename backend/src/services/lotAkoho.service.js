const lotAkohoRepository = require('../repositories/lotAkoho.repository');

async function create(data) {
    // Validation métier
    if (data.date == null || data.nombre == null || data.id_race == null || data.age == null || data.numero == null || data.prix_achat == null) {
        const error = new Error('Tous les champs sont obligatoires : date (string), nombre (int), id_race (int), age (int), numero (int), prix_achat (float)');
        error.status = 400;
        throw error;
    }
    return await lotAkohoRepository.create(data);
}

module.exports = {
    create
}