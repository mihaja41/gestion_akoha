# Frontend Angular — Fiompiana Akoho

## Comment démarrer le projet

### Prérequis
- **Node.js** v18+ (installé via nvm ou directement)
- **Angular CLI** : `npm install -g @angular/cli`
- Le **backend Express** doit tourner sur `http://localhost:3000`

### Lancer le projet

```bash
# 1. Se placer dans le dossier frontend
cd frontend

# 2. Installer les dépendances (à faire une seule fois, ou après un git pull)
npm install

# 3. Démarrer le serveur de développement Angular
ng serve
```

L'application sera accessible sur **http://localhost:4200**.

> **Note :** Le backend Express doit être démarré **avant** ou **en parallèle** pour que les appels API fonctionnent :
> ```bash
> cd backend && npm start    # ← dans un autre terminal
> ```

### Autres commandes utiles

| Commande | Description |
|---|---|
| `ng serve` | Démarre le serveur de dev (port 4200, hot reload) |
| `ng serve --port 4300` | Démarre sur un autre port |
| `ng build` | Compile le projet pour la production (output dans `dist/`) |
| `ng generate component pages/ma-page` | Génère un nouveau composant |
| `ng generate service services/mon-service` | Génère un nouveau service |

---

## Résumé de l'initialisation du projet

### Étape 1 — Création du projet Angular

```bash
npm install -g @angular/cli          # Installer Angular CLI globalement
ng new frontend --routing --style=css --skip-tests --skip-git
```

Options choisies :
- `--routing` : ajoute le module de routage (navigation entre pages)
- `--style=css` : utilise du CSS simple (pas de SCSS/LESS)
- `--skip-tests` : ne génère pas les fichiers de test (pour simplifier l'apprentissage)
- `--skip-git` : ne crée pas un nouveau repo git (on en a déjà un à la racine)

### Étape 2 — Installation de Bootstrap 5 et Bootstrap Icons

```bash
cd frontend
npm install bootstrap bootstrap-icons
```

Puis configuration dans `angular.json` pour charger Bootstrap globalement :

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.css"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

> **Pourquoi dans `angular.json` ?**
> En Vue.js, on importerait Bootstrap dans `main.js`. En Angular, `angular.json` est le point centralisé pour les assets globaux. C'est plus propre et plus explicite.

### Étape 3 — Configuration de HttpClient

Dans `app.config.ts`, on a ajouté `provideHttpClient()` pour rendre le client HTTP disponible partout dans l'app (comme installer Axios en Vue.js) :

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()   // ← Active HttpClient pour toute l'app
  ]
};
```

### Étape 4 — Fichier d'environnement

Créé dans `src/environments/environment.ts` pour centraliser l'URL de l'API :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

> En Vue.js, c'est le `.env` avec `VITE_API_URL`. En Angular, c'est un fichier TypeScript typé.

---

## Architecture du code CRUD — Description Race

### Vue d'ensemble du flux

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular)                        │
│                                                                  │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────────┐   │
│  │  Model    │    │   Service    │    │     Component        │   │
│  │ (interface│◄───│ (HttpClient) │◄───│ (logique + template) │   │
│  │  TypeScript)   │              │    │                      │   │
│  └──────────┘    └──────┬───────┘    └──────────────────────┘   │
│                         │ HTTP GET/POST/PUT/DELETE                │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                       BACKEND (Express.js)                        │
│  Route → Controller → Service → Repository → Base de données     │
└──────────────────────────────────────────────────────────────────┘
```

### Arborescence des fichiers

```
frontend/src/app/
├── app.ts                          ← Composant racine (layout)
├── app.html                        ← Template : sidebar + <router-outlet>
├── app.config.ts                   ← Providers globaux (Router, HttpClient)
├── app.routes.ts                   ← Table de routage
│
├── models/
│   └── description-race.model.ts   ← Interface TypeScript
│
├── services/
│   └── description-race.service.ts ← Appels HTTP vers l'API
│
├── components/
│   └── sidebar/
│       ├── sidebar.ts              ← Logique du sidebar
│       ├── sidebar.html            ← Template du sidebar
│       └── sidebar.css             ← Styles du sidebar
│
└── pages/
    └── description-race/
        ├── description-race.ts     ← Logique CRUD complète
        ├── description-race.html   ← Tableau + modal formulaire
        └── description-race.css    ← Styles de la page
```

---

## Explication détaillée du parcours du code

### 1. Le modèle — `models/description-race.model.ts`

C'est le point de départ. On définit la **forme des données** avec une interface TypeScript :

```typescript
export interface DescriptionRace {
  Id_description_race: number | null;
  age: number;
  variation_poids: number;
  lanja_sakafo: number;
  Id_race: number;
}
```

**Pourquoi ?**
- Les noms de propriétés correspondent exactement à ceux renvoyés par l'API Express
- TypeScript empêche les fautes de frappe (`item.agee` → erreur à la compilation)
- L'IDE propose l'autocomplétion

> **Comparaison Vue.js :** En Vue.js classique, on utilise souvent des objets JavaScript sans typage. Avec Vue 3 + TypeScript, on ferait la même chose.

---

### 2. Le service — `services/description-race.service.ts`

Le service encapsule **tous les appels HTTP** vers l'API backend :

```typescript
@Injectable({ providedIn: 'root' })     // ← Singleton global (comme @Service en Spring Boot)
export class DescriptionRaceService {
  private http = inject(HttpClient);     // ← Injection de dépendances
  private baseUrl = `${environment.apiUrl}/description-races`;

  getAll(): Observable<DescriptionRace[]> {
    return this.http.get<DescriptionRace[]>(this.baseUrl);
  }

  create(data: DescriptionRace): Observable<DescriptionRace> {
    return this.http.post<DescriptionRace>(this.baseUrl, data);
  }

  update(id: number, data: DescriptionRace): Observable<DescriptionRace> {
    return this.http.put<DescriptionRace>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

**Chemin du code :**

1. `@Injectable({ providedIn: 'root' })` → Angular enregistre ce service comme un **singleton** disponible partout
2. `inject(HttpClient)` → Angular injecte automatiquement le client HTTP (configuré dans `app.config.ts`)
3. Chaque méthode retourne un `Observable` (comme une Promise, mais plus puissant)
4. Le générique `<DescriptionRace[]>` dit à TypeScript quel type de données on attend

> **Comparaison Vue.js :**
> ```javascript
> // En Vue.js avec Axios :
> export const getAll = () => axios.get('/api/description-races')
> export const create = (data) => axios.post('/api/description-races', data)
> ```
> La différence : Angular utilise l'injection de dépendances et les Observables, Vue.js utilise des imports directs et des Promises.

---

### 3. Le composant page — `pages/description-race/description-race.ts`

Le composant est le **cœur de la page CRUD**. Il orchestre tout :

```typescript
@Component({
  selector: 'app-description-race',
  imports: [CommonModule, FormsModule],
  templateUrl: './description-race.html',
  styleUrl: './description-race.css'
})
export class DescriptionRaceComponent implements OnInit {

  // Injection du service
  private descriptionRaceService = inject(DescriptionRaceService);

  // État de la page
  descriptionRaces: DescriptionRace[] = [];
  formData: DescriptionRace = { ... };
  formMode: 'create' | 'edit' = 'create';
  loading = false;

  // Chargé au début (comme onMounted en Vue.js)
  ngOnInit(): void {
    this.loadAll();
  }

  // Charger les données
  loadAll(): void {
    this.descriptionRaceService.getAll().subscribe({
      next: (data) => this.descriptionRaces = data,
      error: (err) => console.error(err)
    });
  }

  // Sauvegarder (créer ou modifier)
  save(): void {
    if (this.formMode === 'create') {
      this.descriptionRaceService.create(this.formData).subscribe({ ... });
    } else {
      this.descriptionRaceService.update(id, this.formData).subscribe({ ... });
    }
  }
}
```

**Chemin du code quand la page s'affiche :**

1. L'utilisateur navigue vers `/description-races`
2. Angular charge le composant `DescriptionRaceComponent` (lazy loading)
3. `ngOnInit()` est appelé automatiquement → appelle `loadAll()`
4. `loadAll()` appelle `descriptionRaceService.getAll()` → requête HTTP GET
5. `.subscribe()` attend la réponse → stocke les données dans `descriptionRaces`
6. Le template détecte le changement et affiche le tableau

**Chemin du code quand on clique "Nouveau" :**

1. Clic sur le bouton → `(click)="prepareCreate()"`
2. `prepareCreate()` initialise `formData` vide et `formMode = 'create'`
3. Bootstrap ouvre le modal (`data-bs-toggle="modal"`)
4. L'utilisateur remplit le formulaire (binding `[(ngModel)]`)
5. Clic sur "Créer" → `(click)="save()"`
6. `save()` appelle `descriptionRaceService.create(formData)` → POST HTTP
7. Succès → `loadAll()` recharge la liste, `closeModal()` ferme le modal

**Chemin du code quand on clique "Modifier" :**

1. Clic sur le bouton crayon → `(click)="prepareEdit(item)"`
2. `prepareEdit()` copie l'objet dans `formData` et met `formMode = 'edit'`
3. Le modal s'ouvre avec les données pré-remplies
4. Clic sur "Enregistrer" → `save()` → `update()` → PUT HTTP

**Chemin du code quand on clique "Supprimer" :**

1. Clic sur le bouton poubelle → `(click)="deleteItem(item)"`
2. `confirm()` demande une confirmation
3. Si oui → `descriptionRaceService.delete(id)` → DELETE HTTP
4. Succès → `loadAll()` recharge la liste

---

### 4. Le template — `pages/description-race/description-race.html`

Le template HTML utilise les directives Angular avec Bootstrap 5 :

| Directive Angular | Équivalent Vue.js | Usage |
|---|---|---|
| `@if (loading)` | `v-if="loading"` | Afficher le spinner |
| `@for (item of list; track id)` | `v-for="item in list" :key="id"` | Boucle sur le tableau |
| `[(ngModel)]="formData.age"` | `v-model="formData.age"` | Binding formulaire |
| `(click)="save()"` | `@click="save()"` | Gérer le clic |
| `{{ item.age }}` | `{{ item.age }}` | Interpolation (identique !) |

---

### 5. Le routage — `app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'description-races', pathMatch: 'full' },
  {
    path: 'description-races',
    loadComponent: () =>
      import('./pages/description-race/description-race')
        .then(m => m.DescriptionRaceComponent)
  },
];
```

`loadComponent` utilise le **lazy loading** : le code du composant n'est chargé que quand l'utilisateur visite la route. C'est une bonne pratique pour les performances.

> **Vue.js :** `component: () => import('./views/DescriptionRace.vue')` — même concept !

---

### 6. Le layout — `app.ts` + `app.html`

Le composant racine assemble le sidebar et le contenu des routes :

```html
<div class="d-flex">
  <app-sidebar></app-sidebar>          <!-- Menu de navigation -->
  <main class="flex-grow-1 bg-light">
    <router-outlet />                   <!-- Contenu de la route active -->
  </main>
</div>
```

`<router-outlet>` est l'équivalent Angular de `<router-view>` en Vue.js.

---

## Comment ajouter une nouvelle page CRUD

Pour créer la page "Lots Akoho" (par exemple), il suffit de reproduire le même pattern :

1. **Modèle** : créer `models/lot-akoho.model.ts` (copier et adapter `description-race.model.ts`)
2. **Service** : créer `services/lot-akoho.service.ts` (copier et adapter, changer `baseUrl`)
3. **Page** : créer `pages/lot-akoho/lot-akoho.ts`, `.html`, `.css` (copier et adapter)
4. **Route** : ajouter dans `app.routes.ts` :
   ```typescript
   { path: 'lots-akoho', loadComponent: () => import('./pages/lot-akoho/lot-akoho').then(m => m.LotAkohoComponent) }
   ```
5. **Sidebar** : ajouter un lien dans les `menuItems` de `components/sidebar/sidebar.ts`

---

## Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| Angular | 21.2.x | Framework frontend |
| TypeScript | 5.9.x | Langage (superset de JavaScript) |
| Bootstrap | 5.3.x | Framework CSS |
| Bootstrap Icons | 1.13.x | Icônes |
| RxJS | 7.8.x | Observables (programmation réactive) |
