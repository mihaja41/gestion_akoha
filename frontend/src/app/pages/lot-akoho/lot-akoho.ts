import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LotAkohoService } from '../../services/lot-akoho.service';
import { RaceService } from '../../services/race.service';
import { LotAkoho } from '../../models/lot-akoho.model';
import { Race } from '../../models/race.model';

@Component({
  selector: 'app-lot-akoho',
  imports: [CommonModule, FormsModule],
  templateUrl: './lot-akoho.html',
  styleUrl: './lot-akoho.css'
})
export class LotAkohoComponent implements OnInit {

  private lotAkohoService = inject(LotAkohoService);
  private raceService = inject(RaceService);

  /** Liste de tous les lots de poulets */
  lotsAkoho: LotAkoho[] = [];

  /** Liste des races (pour le <select> du formulaire) */
  races: Race[] = [];

  /** Objet formulaire pour la création/modification */
  formData: LotAkoho = this.getEmptyForm();

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
    this.loadRaces();
  }

  // ── Méthodes CRUD ──────────────────────────────────────────────

  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    this.lotAkohoService.getAll().subscribe({
      next: (data) => {
        this.lotsAkoho = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des lots de poulets.';
        this.loading = false;
        console.error('Erreur chargement:', err);
      }
    });
  }

  loadRaces(): void {
    this.raceService.getAll().subscribe({
      next: (data) => this.races = data,
      error: (err) => console.error('Erreur chargement races:', err)
    });
  }

  getRaceName(idRace: number): string {
    const race = this.races.find(r => r.Id_race === idRace);
    return race ? race.nom : `Race #${idRace}`;
  }

  prepareCreate(): void {
    this.formMode = 'create';
    this.formData = this.getEmptyForm();
    this.clearMessages();
  }

  prepareEdit(item: LotAkoho): void {
    this.formMode = 'edit';
    this.formData = { ...item };
    // Formater la date pour l'input date HTML (YYYY-MM-DD)
    if (this.formData.date_entree) {
      this.formData.date_entree = this.formData.date_entree.substring(0, 10);
    }
    this.clearMessages();
  }

  save(): void {
    this.clearMessages();

    if (this.formMode === 'create') {
      this.lotAkohoService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Lot de poulets créé avec succès !';
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création.';
          console.error('Erreur création:', err);
        }
      });
    } else {
      this.lotAkohoService.update(this.formData.Id_lot_akoho!, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Lot de poulets modifié avec succès !';
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

  deleteItem(item: LotAkoho): void {
    if (!confirm(`Voulez-vous vraiment supprimer le lot n°${item.numero} ?`)) {
      return;
    }

    this.clearMessages();

    this.lotAkohoService.delete(item.Id_lot_akoho!).subscribe({
      next: () => {
        this.successMessage = 'Lot de poulets supprimé avec succès !';
        this.loadAll();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la suppression.';
        console.error('Erreur suppression:', err);
      }
    });
  }

  // ── Méthodes utilitaires ───────────────────────────────────────

  /** Formater une date ISO en format lisible */
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  }

  private getEmptyForm(): LotAkoho {
    return {
      Id_lot_akoho: null,
      numero: 0,
      date_entree: '',
      nombre: 0,
      age: 0,
      prix_achat: 0,
      Id_race: 0
    };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private closeModal(): void {
    const modalElement = document.getElementById('lotAkohoFormModal');
    if (modalElement) {
      const bootstrap = (window as any)['bootstrap'];
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
