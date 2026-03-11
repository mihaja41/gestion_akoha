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

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DescriptionRaceService } from '../../services/description-race.service';
import { RaceService } from '../../services/race.service';
import { DescriptionRace } from '../../models/description-race.model';
import { Race } from '../../models/race.model';

@Component({
  selector: 'app-description-race',
  imports: [CommonModule, FormsModule],
  templateUrl: './description-race.html',
  styleUrl: './description-race.css'
})
export class DescriptionRaceComponent implements OnInit {

  private descriptionRaceService = inject(DescriptionRaceService);
  private raceService = inject(RaceService);

  descriptionRaces = signal<DescriptionRace[]>([]);
  races = signal<Race[]>([]);
  formData: DescriptionRace = this.getEmptyForm();
  formMode: 'create' | 'edit' = 'create';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadAll();
    this.loadRaces();
  }

  loadAll(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.descriptionRaceService.getAll().subscribe({
      next: (data) => {
        this.descriptionRaces.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors du chargement des données.');
        this.loading.set(false);
        console.error('Erreur chargement:', err);
      }
    });
  }

  loadRaces(): void {
    this.raceService.getAll().subscribe({
      next: (data) => this.races.set(data),
      error: (err) => console.error('Erreur chargement races:', err)
    });
  }

  getRaceName(idRace: number): string {
    const race = this.races().find(r => r.Id_race === idRace);
    return race ? race.nom : `Race #${idRace}`;
  }

  prepareCreate(): void {
    this.formMode = 'create';
    this.formData = this.getEmptyForm();
    this.clearMessages();
  }

  prepareEdit(item: DescriptionRace): void {
    this.formMode = 'edit';
    this.formData = { ...item };
    this.clearMessages();
  }

  save(): void {
    this.clearMessages();

    if (this.formMode === 'create') {
      this.descriptionRaceService.create(this.formData).subscribe({
        next: () => {
          this.successMessage.set('Description de race créée avec succès !');
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Erreur lors de la création.');
          console.error('Erreur création:', err);
        }
      });
    } else {
      this.descriptionRaceService.update(this.formData.Id_description_race!, this.formData).subscribe({
        next: () => {
          this.successMessage.set('Description de race modifiée avec succès !');
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Erreur lors de la modification.');
          console.error('Erreur modification:', err);
        }
      });
    }
  }

  deleteItem(item: DescriptionRace): void {
    if (!confirm(`Voulez-vous vraiment supprimer la description #${item.Id_description_race} ?`)) {
      return;
    }

    this.clearMessages();

    this.descriptionRaceService.delete(item.Id_description_race!).subscribe({
      next: () => {
        this.successMessage.set('Description de race supprimée avec succès !');
        this.loadAll();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression.');
        console.error('Erreur suppression:', err);
      }
    });
  }

  private getEmptyForm(): DescriptionRace {
    return {
      Id_description_race: null,
      age: 0,
      variation_poids: 0,
      lanja_sakafo: 0,
      Id_race: 0
    };
  }

  clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private closeModal(): void {
    const modalElement = document.getElementById('formModal');
    if (modalElement) {
      const bootstrap = (window as any)['bootstrap'];
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
