/**
 * Composant Page pour le CRUD de DescriptionRace.
 *
 * ➜ Vue.js : équivalent de views/DescriptionRace.vue
 * ➜ Spring Boot MVC : pas d'équivalent direct (c'est du frontend !)
 *
 * Ce composant gère :
 * - L'affichage de la liste des descriptions de race (tableau)
 * - La création d'une nouvelle description (formulaire dans un modal Bootstrap)
 * - La modification d'une description existante (même modal, pré-rempli)
 * - La suppression d'une description (avec confirmation)
 *
 * CONCEPTS IMPORTANTS :
 *
 * 1. OnInit (implements OnInit)
 *    → Interface qui oblige à implémenter ngOnInit()
 *    → ngOnInit() est appelé APRÈS la construction du composant
 *    → Vue.js : équivalent de onMounted() dans le Composition API
 *
 * 2. inject(DescriptionRaceService)
 *    → Injection de dépendances : Angular fournit automatiquement le service
 *    → Vue.js : pas d'équivalent direct (tu importerais le store/api directement)
 *    → Spring Boot : exactement comme @Autowired
 *
 * 3. .subscribe()
 *    → S'abonne à l'Observable retourné par le service HTTP
 *    → Vue.js : équivalent de .then() sur une Promise
 *    → Exemple :
 *        Vue.js   : axios.get('/api/...').then(res => this.data = res.data)
 *        Angular  : this.http.get('/api/...').subscribe(data => this.data = data)
 *
 * 4. FormsModule (ngModel)
 *    → Binding bidirectionnel pour les formulaires
 *    → Vue.js : exactement comme v-model !
 *    → [(ngModel)]="variable" en Angular = v-model="variable" en Vue.js
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DescriptionRaceService } from '../../services/description-race.service';
import { RaceService } from '../../services/race.service';
import { DescriptionRace } from '../../models/description-race.model';
import { Race } from '../../models/race.model';

@Component({
  selector: 'app-description-race',
  imports: [CommonModule, FormsModule],  // ← CommonModule pour @if/@for, FormsModule pour ngModel
  templateUrl: './description-race.html',
  styleUrl: './description-race.css'
})
export class DescriptionRaceComponent implements OnInit {

  // ── Injection des services ──────────────────────────────────────
  // ➜ Vue.js : const api = useDescriptionRaceApi()
  // ➜ Spring Boot : @Autowired private DescriptionRaceService service;
  private descriptionRaceService = inject(DescriptionRaceService);

  /**
   * Service Race : injecté pour charger la liste des races dans le <select>.
   * ➜ En Angular, on peut injecter PLUSIEURS services dans un même composant.
   * ➜ Spring Boot : c'est comme avoir plusieurs @Autowired
   */
  private raceService = inject(RaceService);

  // ── État du composant ──────────────────────────────────────────
  // ➜ Vue.js : const descriptionRaces = ref<DescriptionRace[]>([])
  // En Angular, ce sont simplement des propriétés de la classe

  /** Liste de toutes les descriptions de race */
  descriptionRaces: DescriptionRace[] = [];

  /** Liste des races (pour le <select> du formulaire) */
  races: Race[] = [];

  /** Objet formulaire pour la création/modification */
  formData: DescriptionRace = this.getEmptyForm();

  /** Mode du formulaire : 'create' ou 'edit' */
  formMode: 'create' | 'edit' = 'create';

  /** Indicateur de chargement */
  loading = false;

  /** Message d'erreur à afficher */
  errorMessage = '';

  /** Message de succès à afficher */
  successMessage = '';

  // ── Cycle de vie ───────────────────────────────────────────────

  /**
   * ngOnInit() : appelé une fois le composant initialisé.
   * ➜ Vue.js : onMounted(() => { ... })
   * ➜ Spring Boot : @PostConstruct
   *
   * C'est ici qu'on charge les données initiales.
   */
  ngOnInit(): void {
    this.loadAll();
    this.loadRaces();  // ← Charger les races pour le <select> du formulaire
  }

  // ── Méthodes CRUD ──────────────────────────────────────────────

  /**
   * Charger toutes les descriptions de race depuis l'API.
   * ➜ Vue.js :
   *    const loadAll = async () => {
   *      loading.value = true
   *      const { data } = await axios.get('/api/description-races')
   *      descriptionRaces.value = data
   *      loading.value = false
   *    }
   */
  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    this.descriptionRaceService.getAll().subscribe({
      // ➜ next : appelé quand la requête réussit (comme .then())
      next: (data) => {
        this.descriptionRaces = data;
        this.loading = false;
      },
      // ➜ error : appelé si la requête échoue (comme .catch())
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des données.';
        this.loading = false;
        console.error('Erreur chargement:', err);
      }
    });
  }

  /**
   * Charger la liste des races depuis l'API GET /api/races.
   * Appelé une seule fois dans ngOnInit().
   * Les races sont stockées pour être réutilisées dans :
   *   - le <select> du formulaire
   *   - l'affichage du nom de race dans le tableau (méthode getRaceName())
   */
  loadRaces(): void {
    this.raceService.getAll().subscribe({
      next: (data) => this.races = data,
      error: (err) => console.error('Erreur chargement races:', err)
    });
  }

  /**
   * Trouver le nom d'une race à partir de son ID.
   * Utilisé dans le tableau pour afficher "Brahma" au lieu de "1".
   *
   * ➜ Vue.js : tu ferais un computed ou une méthode dans le template
   *    {{ races.find(r => r.Id_race === item.Id_race)?.nom }}
   */
  getRaceName(idRace: number): string {
    const race = this.races.find(r => r.Id_race === idRace);
    return race ? race.nom : `Race #${idRace}`;
  }

  /**
   * Préparer le formulaire pour la création.
   * Appelé quand on clique sur "Nouveau".
   */
  prepareCreate(): void {
    this.formMode = 'create';
    this.formData = this.getEmptyForm();
    this.clearMessages();
  }

  /**
   * Préparer le formulaire pour la modification.
   * Appelé quand on clique sur le bouton "Modifier" d'une ligne.
   *
   * On utilise le spread operator { ...item } pour COPIER l'objet.
   * ➜ Si on faisait this.formData = item, modifier le formulaire
   *    modifierait aussi la ligne du tableau (même référence objet) !
   */
  prepareEdit(item: DescriptionRace): void {
    this.formMode = 'edit';
    this.formData = { ...item };  // ← Copie de l'objet (pas la référence !)
    this.clearMessages();
  }

  /**
   * Sauvegarder (créer ou modifier) selon le mode du formulaire.
   * ➜ Vue.js :
   *    const save = async () => {
   *      if (formMode.value === 'create') await axios.post(...)
   *      else await axios.put(...)
   *    }
   */
  save(): void {
    this.clearMessages();

    if (this.formMode === 'create') {
      this.descriptionRaceService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Description de race créée avec succès !';
          this.loadAll();                // Recharger la liste
          this.closeModal();             // Fermer le modal
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création.';
          console.error('Erreur création:', err);
        }
      });
    } else {
      this.descriptionRaceService.update(this.formData.Id_description_race!, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Description de race modifiée avec succès !';
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification.';
          console.error('Erreur modification:', err);
        }
      });
    }
  }

  /**
   * Supprimer une description de race.
   * On utilise confirm() pour une confirmation simple.
   */
  deleteItem(item: DescriptionRace): void {
    if (!confirm(`Voulez-vous vraiment supprimer la description #${item.Id_description_race} ?`)) {
      return;
    }

    this.clearMessages();

    this.descriptionRaceService.delete(item.Id_description_race!).subscribe({
      next: () => {
        this.successMessage = 'Description de race supprimée avec succès !';
        this.loadAll();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la suppression.';
        console.error('Erreur suppression:', err);
      }
    });
  }

  // ── Méthodes utilitaires ───────────────────────────────────────

  /** Retourne un objet formulaire vide (pour la création) */
  private getEmptyForm(): DescriptionRace {
    return {
      Id_description_race: null,
      age: 0,
      variation_poids: 0,
      lanja_sakafo: 0,
      Id_race: 0
    };
  }

  /** Effacer les messages d'erreur et de succès */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Fermer le modal Bootstrap programmatiquement.
   *
   * NOTE : On accède au DOM directement ici, ce qui n'est pas idéal en Angular.
   * Pour un projet plus avancé, on utiliserait un ViewChild ou ng-bootstrap.
   * Mais pour apprendre, cette approche simple fonctionne très bien.
   */
  private closeModal(): void {
    const modalElement = document.getElementById('formModal');
    if (modalElement) {
      // Bootstrap expose son API JS pour contrôler les modals
      const bootstrap = (window as any)['bootstrap'];
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
