/**
 * Point d'entrée du serveur.
 * 
 * ➜ Spring Boot : équivalent du main() dans la classe @SpringBootApplication
 *
 *   public static void main(String[] args) {
 *       SpringApplication.run(Application.class, args);
 *   }
 *
 * Ici on démarre le serveur Express sur le port configuré.
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📡 API doc : http://localhost:${PORT}/api/docs`);
});
