import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AkohoMatyService } from '../../services/akoho-maty.service';
import { LotAkohoService } from '../../services/lot-akoho.service';
import { AkohoMaty } from '../../models/akoho-maty.model';
import { LotAkoho } from '../../models/lot-akoho.model';

@Component({
  selector: 'app-akoho-maty',
  imports: [CommonModule, FormsModule],
  templateUrl: './akoho-maty.html',
  styleUrl: './akoho-maty.css'
})
export class AkohoMatyComponent implements OnInit {

  private akohoMatyService = inject(AkohoMatyService);
  private lotAkohoService = inject(LotAkohoService);

  /** Liste de tous les poulets morts */
  items: AkohoMaty[] = [];

  /** Cache des lots de poulets (pour afficher le numéro) */
  lotsAkohoMap: Map<number, LotAkoho> = new Map();

  /** Objet formulaire */
  formData: AkohoMaty = this.getEmptyForm();

  /** Numéro de lot saisi par l'utilisateur dans le formulaire */
  formNumeroLot: number | null = null;

  /** Message d'erreur lié à la résolution du numéro de lot */
  lotLookupError = '';

  formMode: 'create' | 'edit' = 'create';
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadAll();
  }

  // ── Chargement ─────────────────────────────────────────────────

  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    this.akohoMatyService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        // Charger les infos des lots pour l'affichage
        this.loadLotsInfo();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des données.';
        this.loading = false;
        console.error('Erreur chargement:', err);
      }
    });
  }

  /** Charger les infos des lots référencés pour afficher le numéro au lieu de l'ID */
  loadLotsInfo(): void {
    const uniqueIds = [...new Set(this.items.map(i => i.Id_lot_akoho))];
    uniqueIds.forEach(id => {
      if (!this.lotsAkohoMap.has(id)) {
        this.lotAkohoService.getById(id).subscribe({
          next: (lot) => this.lotsAkohoMap.set(id, lot),
          error: () => {} // silently ignore
        });
      }
    });
  }

  getLotNumero(idLotAkoho: number): string {
    const lot = this.lotsAkohoMap.get(idLotAkoho);
    return lot ? `Lot n°${lot.numero}` : `Lot #${idLotAkoho}`;
  }

  // ── CRUD ───────────────────────────────────────────────────────

  prepareCreate(): void {
    this.formMode = 'create';
    this.formData = this.getEmptyForm();
    this.formNumeroLot = null;
    this.lotLookupError = '';
    this.clearMessages();
  }

  prepareEdit(item: AkohoMaty): void {
    this.formMode = 'edit';
    this.formData = { ...item };
    if (this.formData.date_mort) {
      this.formData.date_mort = this.formData.date_mort.substring(0, 10);
    }
    // Pré-remplir le numéro de lot
    const lot = this.lotsAkohoMap.get(item.Id_lot_akoho);
    this.formNumeroLot = lot ? lot.numero : null;
    this.lotLookupError = '';
    this.clearMessages();
  }

  save(): void {
    this.clearMessages();
    this.lotLookupError = '';

    if (!this.formNumeroLot) {
      this.lotLookupError = 'Veuillez saisir un numéro de lot.';
      return;
    }

    // Résoudre le numéro de lot → Id_lot_akoho, puis sauvegarder
    this.lotAkohoService.getByNumero(this.formNumeroLot).subscribe({
      next: (lot) => {
        this.formData.Id_lot_akoho = lot.Id_lot_akoho!;
        this.lotsAkohoMap.set(lot.Id_lot_akoho!, lot);
        this.doSave();
      },
      error: (err) => {
        this.lotLookupError = err.error?.message || `Aucun lot de poulets trouvé avec le numéro ${this.formNumeroLot}.`;
      }
    });
  }

  private doSave(): void {
    if (this.formMode === 'create') {
      this.akohoMatyService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Poulet mort enregistré avec succès !';
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création.';
          console.error('Erreur création:', err);
        }
      });
    } else {
      this.akohoMatyService.update(this.formData.Id_akoho_maty!, this.formData).subscribe({
        next: () => {
          this.successMessage = 'Enregistrement modifié avec succès !';
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

  deleteItem(item: AkohoMaty): void {
    if (!confirm(`Voulez-vous vraiment supprimer cet enregistrement #${item.Id_akoho_maty} ?`)) {
      return;
    }

    this.clearMessages();

    this.akohoMatyService.delete(item.Id_akoho_maty!).subscribe({
      next: () => {
        this.successMessage = 'Enregistrement supprimé avec succès !';
        this.loadAll();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la suppression.';
        console.error('Erreur suppression:', err);
      }
    });
  }

  // ── Utilitaires ────────────────────────────────────────────────

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  }

  private getEmptyForm(): AkohoMaty {
    return {
      Id_akoho_maty: null,
      date_mort: '',
      nombre: 0,
      Id_lot_akoho: 0
    };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private closeModal(): void {
    const modalElement = document.getElementById('akohoMatyFormModal');
    if (modalElement) {
      const bootstrap = (window as any)['bootstrap'];
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }
}
