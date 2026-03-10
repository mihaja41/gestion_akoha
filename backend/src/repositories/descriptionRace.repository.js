/**
 * Repository DescriptionRace — couche d'accès aux données (Data Access Layer).
 * 
 * ➜ Spring Boot : équivalent d'une interface @Repository qui extends JpaRepository
 *
 *   @Repository
 *   public interface DescriptionRaceRepository extends JpaRepository<DescriptionRace, Integer> { }
 *
 * Ici on écrit les requêtes SQL manuellement car Express n'a pas de JPA.
 * On utilise le driver `mssql` avec des requêtes paramétrées pour éviter les injections SQL.
 */

const { sql, getPool } = require('../config/database');

/**
 * Récupérer toutes les descriptions de race.
 * ➜ Spring Boot : repository.findAll()
 */
async function findAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM description_race');
    return result.recordset;
}

/**
 * Récupérer une description de race par son ID.
 * ➜ Spring Boot : repository.findById(id)
 */
async function findById(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM description_race WHERE Id_description_race = @id');
    return result.recordset[0] || null;
}

/**
 * Créer une nouvelle description de race.
 * ➜ Spring Boot : repository.save(entity)   (INSERT)
 */
async function create({ age, variation_poids, lanja_sakafo, Id_race }) {
    const pool = await getPool();
    const result = await pool.request()
        .input('age', sql.Int, age)
        .input('variation_poids', sql.Float, variation_poids)
        .input('lanja_sakafo', sql.Float, lanja_sakafo)
        .input('Id_race', sql.Int, Id_race)
        .query(`
            INSERT INTO description_race (age, variation_poids, lanja_sakafo, Id_race)
            OUTPUT INSERTED.*
            VALUES (@age, @variation_poids, @lanja_sakafo, @Id_race)
        `);
    return result.recordset[0];
}

/**
 * Mettre à jour une description de race existante.
 * ➜ Spring Boot : repository.save(entity)   (UPDATE quand l'ID existe)
 */
async function update(id, { age, variation_poids, lanja_sakafo, Id_race }) {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('age', sql.Int, age)
        .input('variation_poids', sql.Float, variation_poids)
        .input('lanja_sakafo', sql.Float, lanja_sakafo)
        .input('Id_race', sql.Int, Id_race)
        .query(`
            UPDATE description_race
            SET age = @age,
                variation_poids = @variation_poids,
                lanja_sakafo = @lanja_sakafo,
                Id_race = @Id_race
            WHERE Id_description_race = @id;
            
            SELECT * FROM description_race WHERE Id_description_race = @id;
        `);
    return result.recordset[0] || null;
}

/**
 * Supprimer une description de race par son ID.
 * ➜ Spring Boot : repository.deleteById(id)
 */
async function deleteById(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM description_race WHERE Id_description_race = @id');
    return result.rowsAffected[0] > 0;
}

/**
 * Récupérer toutes les descriptions d'une race, triées par âge (semaine).
 */
async function findAllByRaceId(raceId) {
    const pool = await getPool();
    const result = await pool.request()
        .input('raceId', sql.Int, raceId)
        .query('SELECT * FROM description_race WHERE Id_race = @raceId ORDER BY age ASC');
    return result.recordset;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteById,
    findAllByRaceId
};
