const { sql, getPool } = require('../config/database');

async function findAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM akoho_maty');
    return result.recordset;
}

async function findById(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM akoho_maty WHERE Id_akoho_maty = @id');
    return result.recordset[0] || null;
}

async function create({ date_mort, nombre, Id_lot_akoho }) {
    const pool = await getPool();
    const result = await pool.request()
        .input('date_mort', sql.Date, date_mort)
        .input('nombre', sql.Int, nombre)
        .input('Id_lot_akoho', sql.Int, Id_lot_akoho)
        .query(`
            INSERT INTO akoho_maty (date_mort, nombre, Id_lot_akoho)
            OUTPUT INSERTED.*
            VALUES (@date_mort, @nombre, @Id_lot_akoho)
        `);
    return result.recordset[0];
}

async function update(id, { date_mort, nombre, Id_lot_akoho }) {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('date_mort', sql.Date, date_mort)
        .input('nombre', sql.Int, nombre)
        .input('Id_lot_akoho', sql.Int, Id_lot_akoho)
        .query(`
            UPDATE akoho_maty
            SET date_mort = @date_mort, nombre = @nombre, Id_lot_akoho = @Id_lot_akoho
            WHERE Id_akoho_maty = @id;
            SELECT * FROM akoho_maty WHERE Id_akoho_maty = @id;
        `);
    return result.recordset[0] || null;
}

async function deleteById(id) {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM akoho_maty WHERE Id_akoho_maty = @id');
    return result.rowsAffected[0] > 0;
}

module.exports = { findAll, findById, create, update, deleteById };
