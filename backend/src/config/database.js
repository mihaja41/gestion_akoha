/**
 * Configuration de la connexion à SQL Server.
 * 
 * ➜ Spring Boot : équivalent de application.properties / application.yml
 *   (spring.datasource.url, spring.datasource.username, etc.)
 */

const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,           // pas besoin en local Docker
        trustServerCertificate: true
    }
};

let pool;

/**
 * Retourne un pool de connexions réutilisable (singleton).
 * ➜ Spring Boot : géré automatiquement par HikariCP (connection pool).
 */
async function getPool() {
    if (!pool) {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connecté à SQL Server');
    }
    return pool;
}

module.exports = { sql, getPool };

// lancement du container docker pour SQL Server
// docker run -e "ACCEPT_EULA=Y" -e "ADMIN_PASSWORD=admin" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
