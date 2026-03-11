import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RaceService } from '../../services/race.service';
import { Race } from '../../models/race.model';

@Component({
  selector: 'app-race',
  imports: [CommonModule, FormsModule],
  templateUrl: './race.html',
  styleUrl: './race.css'
})
export class RaceComponent implements OnInit {

  private raceService = inject(RaceService);

  /** Liste de toutes les races */
  races: Race[] = [];

  /** Objet formulaire pour la création/modification */
  formData: Race = this.getEmptyForm();

  /** Mode du formulaire : 'create' ou 'edit' */
  formMode: 'create' | 'edit' = 'create';

  /** Indicateur de chargement */
  loading = false;

  /** Message d'erreur à afficher */
  errorMessage = '';

  /** Message de succès à afficher */
  successMessage = '';

  ngOnInit(): void {
    this.loadAll();
  }

  // ── Méthodes CRUD ──────────────────────────────────────────────

  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    this.raceService.getAll().subscribe({
      next: (data) => {
        this.races = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des races.';
        this.loading = false;
        console.error('Erreur chargement:', err);
      }
    });
  }

  prepareCreate(): void {
    this.formMode = 'create';
    this.formData = this.getEmptyForm();
    this.clearMessages();
  }

  prepareEdit(item: Race): void {
    this.formMode = 'edit';
    this.formData = { ...item };
    this.clearMessages();
  }

  save(): void {
    this.clearMessages();

    if (this.formMode === 'create') {
      this.raceService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Race créée avec succès !';
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création.';
          console.error('Erreur création:', err);
        }
      });
    } else {
      this.raceService.update(this.formData.Id_race!, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Race modifiée avec succès !';
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la modification.';
          console.error('Erreur modification:', err);
        }
      });
    }
  }

  deleteItem(item: Race): void {
    if (!confirm(`Voulez-vous vraiment supprimer la race "${item.nom}" ?`)) {
      return;
    }

    this.clearMessages();

    this.raceService.delete(item.Id_race!).subscribe({
      next: () => {
        this.successMessage = 'Race supprimée avec succès !';
        this.loadAll();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression.';
        console.error('Erreur suppression:', err);
      }
    });
  }

  // ── Méthodes utilitaires ───────────────────────────────────────

  private getEmptyForm(): Race {
    return {
      Id_race: null,
      nom: '',
      prix_sakafo: 0,
      prix_vente: 0,
      prix_vente_atody: 0
    };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private closeModal(): void {
    const modalElement = document.getElementById('raceFormModal');
    if (modalElement) {
      const bootstrap = (window as any)['bootstrap'];
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
