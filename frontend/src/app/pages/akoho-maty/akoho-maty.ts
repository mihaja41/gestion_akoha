import { Component, OnInit, inject, signal } from '@angular/core';
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

  items = signal<AkohoMaty[]>([]);
  lotsAkohoMap = signal(new Map<number, LotAkoho>());
  formData: AkohoMaty = this.getEmptyForm();
  formNumeroLot: number | null = null;
  lotLookupError = signal('');
  formMode: 'create' | 'edit' = 'create';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.akohoMatyService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
        this.loadLotsInfo();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors du chargement des données.');
        this.loading.set(false);
        console.error('Erreur chargement:', err);
      }
    });
  }

  loadLotsInfo(): void {
    const uniqueIds = [...new Set(this.items().map(i => i.Id_lot_akoho))];
    uniqueIds.forEach(id => {
      if (!this.lotsAkohoMap().has(id)) {
        this.lotAkohoService.getById(id).subscribe({
          next: (lot) => {
            this.lotsAkohoMap.update(map => {
              const newMap = new Map(map);
              newMap.set(id, lot);
              return newMap;
            });
          },
          error: () => {}
        });
      }
    });
  }

  getLotNumero(idLotAkoho: number): string {
    const lot = this.lotsAkohoMap().get(idLotAkoho);
    return lot ? `Lot n°${lot.numero}` : `Lot #${idLotAkoho}`;
  }

  prepareCreate(): void {
    this.formMode = 'create';
    this.formData = this.getEmptyForm();
    this.formNumeroLot = null;
    this.lotLookupError.set('');
    this.clearMessages();
  }

  prepareEdit(item: AkohoMaty): void {
    this.formMode = 'edit';
    this.formData = { ...item };
    if (this.formData.date_mort) {
      this.formData.date_mort = this.formData.date_mort.substring(0, 10);
    }
    const lot = this.lotsAkohoMap().get(item.Id_lot_akoho);
    this.formNumeroLot = lot ? lot.numero : null;
    this.lotLookupError.set('');
    this.clearMessages();
  }

  save(): void {
    this.clearMessages();
    this.lotLookupError.set('');

    if (!this.formNumeroLot) {
      this.lotLookupError.set('Veuillez saisir un numéro de lot.');
      return;
    }

    this.lotAkohoService.getByNumero(this.formNumeroLot).subscribe({
      next: (lot) => {
        this.formData.Id_lot_akoho = lot.Id_lot_akoho!;
        this.lotsAkohoMap.update(map => {
          const newMap = new Map(map);
          newMap.set(lot.Id_lot_akoho!, lot);
          return newMap;
        });
        this.doSave();
      },
      error: (err) => {
        this.lotLookupError.set(err.error?.message || `Aucun lot de poulets trouvé avec le numéro ${this.formNumeroLot}.`);
      }
    });
  }

  private doSave(): void {
    if (this.formMode === 'create') {
      this.akohoMatyService.create(this.formData).subscribe({
        next: () => {
          this.successMessage.set('Poulet mort enregistré avec succès !');
          this.loadAll();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Erreur lors de la création.');
          console.error('Erreur création:', err);
        }
      });
    } else {
      this.akohoMatyService.update(this.formData.Id_akoho_maty!, this.formData).subscribe({
        next: () => {
          this.successMessage.set('Enregistrement modifié avec succès !');
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

  deleteItem(item: AkohoMaty): void {
    if (!confirm(`Voulez-vous vraiment supprimer cet enregistrement #${item.Id_akoho_maty} ?`)) {
      return;
    }

    this.clearMessages();

    this.akohoMatyService.delete(item.Id_akoho_maty!).subscribe({
      next: () => {
        this.successMessage.set('Enregistrement supprimé avec succès !');
        this.loadAll();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression.');
        console.error('Erreur suppression:', err);
      }
    });
  }

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

  clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
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
