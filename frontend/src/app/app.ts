/**
 * Composant racine de l'application.
 *
 * ➜ Vue.js : équivalent de App.vue
 *     <template>
 *       <Sidebar />
 *       <router-view />     ← Affiche le composant de la route active
 *     </template>
 *
 * ➜ Angular :
 *     <app-sidebar />       ← Notre composant sidebar
 *     <router-outlet />     ← Équivalent de <router-view> en Vue.js
 *
 * Le layout est simple : sidebar à gauche, contenu à droite (flexbox).
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],  // ← On importe les composants utilisés dans le template
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
