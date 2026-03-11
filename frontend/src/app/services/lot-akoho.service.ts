import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LotAkoho } from '../models/lot-akoho.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LotAkohoService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/lots-akoho`;

  /** Récupérer tous les lots de poulets */
  getAll(): Observable<LotAkoho[]> {
    return this.http.get<LotAkoho[]>(this.baseUrl);
  }

  /** Récupérer un lot par son ID */
  getById(id: number): Observable<LotAkoho> {
    return this.http.get<LotAkoho>(`${this.baseUrl}/${id}`);
  }

  /** Récupérer un lot par son numéro */
  getByNumero(numero: number): Observable<LotAkoho> {
    return this.http.get<LotAkoho>(`${this.baseUrl}/numero/${numero}`);
  }

  /** Créer un nouveau lot de poulets */
  create(lot: LotAkoho): Observable<LotAkoho> {
    return this.http.post<LotAkoho>(this.baseUrl, lot);
  }

  /** Mettre à jour un lot existant */
  update(id: number, lot: LotAkoho): Observable<LotAkoho> {
    return this.http.put<LotAkoho>(`${this.baseUrl}/${id}`, lot);
  }

  /** Supprimer un lot par son ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
