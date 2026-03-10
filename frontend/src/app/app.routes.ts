/**
 * Configuration des routes de l'application.
 *
 * ➜ Vue.js : équivalent de router/index.js
 *     const routes = [
 *       { path: '/description-races', component: DescriptionRaceView }
 *     ]
 *     const router = createRouter({ routes })
 *
 * ➜ Spring Boot MVC : équivalent de @RequestMapping sur les controllers
 *
 * CONCEPT IMPORTANT — Lazy Loading :
 * On utilise loadComponent avec une fonction fléchée pour charger les composants
 * "à la demande" (lazy loading). Le composant n'est chargé que quand l'utilisateur
 * navigue vers cette route. Cela améliore les performances de chargement initial.
 * ➜ Vue.js : même concept avec () => import('./views/MonComposant.vue')
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirection de la page d'accueil vers description-races
  {
    path: '',
    redirectTo: 'description-races',
    pathMatch: 'full'  // ← 'full' signifie que le chemin doit correspondre EXACTEMENT à ''
  },

  // Route pour la page Description Races
  {
    path: 'description-races',
    loadComponent: () =>
      import('./pages/description-race/description-race').then(m => m.DescriptionRaceComponent)
    // ↑ Lazy loading : le composant est chargé uniquement quand on navigue vers cette route
    // ➜ Vue.js : component: () => import('./views/DescriptionRace.vue')
  },

  // ── Ajoute tes prochaines routes ici ──
  // {
  //   path: 'lots-akoho',
  //   loadComponent: () => import('./pages/lot-akoho/lot-akoho').then(m => m.LotAkohoComponent)
  // },
];
