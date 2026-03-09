const { sql, getPool } = require('../config/database')
async function create({ date, nombre, id_race, age, numero, prix_achat }) {
    const pool = await getPool();
    const result = await pool.request().input('date', sql.Date, date)
        .input('nombre', sql.Int, nombre)
        .input('id_race', sql.Int, id_race)
        .input('age', sql.Int, age)
        .input('numero', sql.Int, numero)
        .input('prix_achat', sql.Float, prix_achat)
        .query(`
        INSERT INTO lot_akoho (date_entree, nombre, Id_race, age, numero, prix_achat)
        OUTPUT INSERTED.*
        VALUES (@date, @nombre, @id_race, @age, @numero, @prix_achat)
    `);
    return result.recordset[0]; 
}

module.exports = {
    create
}