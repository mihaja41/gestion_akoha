/**
 * Configuration de l'environnement de production.
 *
 * ➜ Ce fichier remplacera environment.ts lors du build de production.
 * ➜ Spring Boot : équivalent de application-prod.properties
 *
 * En production, l'API sera servie depuis le même domaine (ou un domaine configuré).
 */
export const environment = {
  production: true,
  apiUrl: '/api'  // En production, on utilise un chemin relatif
};
