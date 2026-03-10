/**
 * Service pour les appels API de Race.
 *
 * On n'a besoin ici que de getAll() pour alimenter le <select> du formulaire.
 * Tu pourras ajouter les autres méthodes CRUD plus tard quand tu créeras la page Race.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Race } from '../models/race.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/races`;

  /** Récupérer toutes les races (pour le select) */
  getAll(): Observable<Race[]> {
    return this.http.get<Race[]>(this.baseUrl);
  }
}
