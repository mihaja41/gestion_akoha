/**
 * Configuration de l'application Express.
 * 
 * ➜ Spring Boot : équivalent de la classe principale @SpringBootApplication
 *   Ici, on configure les middlewares (comme les @Bean de configuration Spring)
 *   et on enregistre les routes (comme le component scan de Spring Boot).
 */

const express = require('express');
const cors = require('cors');

const descriptionRaceRoutes = require('./routes/descriptionRace.routes');
const lotAkohoRoutes = require('./routes/lotAkoho.routes');
const raceRoutes = require('./routes/race.routes');
const lotAtodyRoutes = require('./routes/lotAtody.routes');
const naissanceOeufRoutes = require('./routes/naissanceOeuf.routes');
const akohoMatyRoutes = require('./routes/akohoMaty.routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Middlewares globaux ──────────────────────────────────────────
// ➜ Spring Boot : équivalent des filtres (WebMvcConfigurer, @Bean CorsFilter, etc.)

app.use(cors());                // Autoriser les requêtes cross-origin
app.use(express.json());        // Parser le body JSON (comme @RequestBody en Spring)

// ── Routes ───────────────────────────────────────────────────────
// ➜ Spring Boot : le path de base est défini ici, comme un @RequestMapping global

app.use('/api/description-races', descriptionRaceRoutes);
app.use('/api/lots-akoho', lotAkohoRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/lots-atody', lotAtodyRoutes);
app.use('/api/naissances-oeuf', naissanceOeufRoutes);
app.use('/api/akoho-maty', akohoMatyRoutes);

// Route de test / health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// ── Error Handler (doit être le DERNIER middleware) ──────────────
// ➜ Spring Boot : @ControllerAdvice

app.use(errorHandler);

module.exports = app;
