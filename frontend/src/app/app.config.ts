/**
 * Configuration globale de l'application Angular.
 *
 * ➜ Vue.js : équivalent de main.js où tu fais app.use(router), app.use(pinia), etc.
 * ➜ Spring Boot : équivalent de @SpringBootApplication qui configure tout automatiquement.
 *
 * Ici, on déclare les "providers" (fournisseurs) qui seront disponibles
 * dans TOUTE l'application via l'injection de dépendances.
 *
 * provideRouter(routes)      → Configure le routeur (comme vue-router)
 * provideHttpClient()        → Configure HttpClient pour les appels API (comme axios)
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()   // ← Active HttpClient pour toute l'app (comme installer axios)
  ]
};
