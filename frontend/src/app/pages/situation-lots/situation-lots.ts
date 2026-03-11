import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SituationLotsService } from '../../services/situation-lots.service';
import { SituationLot } from '../../models/situation-lot.model';

@Component({
  selector: 'app-situation-lots',
  imports: [CommonModule, FormsModule],
  templateUrl: './situation-lots.html',
  styleUrl: './situation-lots.css'
})
export class SituationLotsComponent implements OnInit {

  private situationLotsService = inject(SituationLotsService);

  situations = signal<SituationLot[]>([]);
  selectedDate = this.getTodayDate();
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadSituation();
  }

  loadSituation(): void {
    if (!this.selectedDate) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.situationLotsService.getSituationByDate(this.selectedDate).subscribe({
      next: (response) => {
        this.situations.set(response.situations);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors du chargement de la situation.');
        this.situations.set([]);
        this.loading.set(false);
        console.error('Erreur chargement situation:', err);
      }
    });
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value) + ' Ar';
  }

  getBeneficeClass(value: number): string {
    if (value > 0) return 'text-success fw-bold';
    if (value < 0) return 'text-danger fw-bold';
    return '';
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
