/**
 * Service DescriptionRace — couche de logique métier (Business Logic Layer).
 * 
 * ➜ Spring Boot : équivalent d'une classe @Service
 *
 *   @Service
 *   public class DescriptionRaceService {
 *       @Autowired
 *       private DescriptionRaceRepository repository;
 *       
 *       public List<DescriptionRace> getAll() { return repository.findAll(); }
 *       ...
 *   }
 *
 * Le service appelle le repository et peut ajouter de la validation / logique métier.
 * Le controller ne doit JAMAIS appeler le repository directement.
 */

const descriptionRaceRepository = require('../repositories/descriptionRace.repository');

/**
 * Récupérer toutes les descriptions de race.
 */
async function getAll() {
    return await descriptionRaceRepository.findAll();
}

/**
 * Récupérer une description de race par ID.
 * @throws {Error} si non trouvée
 */
async function getById(id) {
    const descriptionRace = await descriptionRaceRepository.findById(id);
    if (!descriptionRace) {
        const error = new Error(`DescriptionRace avec l'id ${id} introuvable`);
        error.status = 404;
        throw error;
    }
    return descriptionRace;
}

/**
 * Créer une nouvelle description de race.
 */
async function create(data) {
    // Validation métier
    if (data.age == null || data.variation_poids == null || data.lanja_sakafo == null || !data.Id_race) {
        const error = new Error('Tous les champs sont obligatoires : age (int), variation_poids (float), lanja_sakafo (float), Id_race (int)');
        error.status = 400;
        throw error;
    }
    return await descriptionRaceRepository.create(data);
}

/**
 * Mettre à jour une description de race.
 */
async function update(id, data) {
    // Vérifier l'existence avant la mise à jour
    await getById(id);

    const updated = await descriptionRaceRepository.update(id, data);
    if (!updated) {
        const error = new Error(`Échec de la mise à jour de DescriptionRace id ${id}`);
        error.status = 500;
        throw error;
    }
    return updated;
}

/**
 * Supprimer une description de race par ID.
 */
async function deleteById(id) {
    // Vérifier l'existence avant la suppression
    await getById(id);

    const deleted = await descriptionRaceRepository.deleteById(id);
    if (!deleted) {
        const error = new Error(`Échec de la suppression de DescriptionRace id ${id}`);
        error.status = 500;
        throw error;
    }
    return true;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};
