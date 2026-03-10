/**
 * Configuration de l'environnement de développement.
 *
 * ➜ Vue.js : équivalent du fichier .env avec VITE_API_URL
 * ➜ Spring Boot : équivalent de application-dev.properties
 *
 * Angular utilise des fichiers d'environnement TypeScript typés,
 * ce qui est plus sûr que les variables .env (autocomplétion + typage).
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // URL de base de notre API Express
};
