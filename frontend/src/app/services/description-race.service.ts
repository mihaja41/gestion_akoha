/**
 * Service pour les appels API de DescriptionRace.
 *
 * ➜ Vue.js : équivalent d'un fichier api/descriptionRace.js avec axios
 *     // En Vue.js, tu ferais :
 *     // export const getAll = () => axios.get('/api/description-races')
 *     // export const create = (data) => axios.post('/api/description-races', data)
 *
 * ➜ Spring Boot : équivalent d'un @Service qui appelle un autre service REST
 *
 * ➜ Express (notre backend) : ce service Angular APPELLE le service Express
 *     Le flux est : Angular Service → HTTP → Express Controller → Express Service → Base de données
 *
 * CONCEPTS IMPORTANTS :
 *
 * 1. @Injectable({ providedIn: 'root' })
 *    → Rend le service disponible partout dans l'app (singleton)
 *    → C'est comme un @Service @Singleton en Spring Boot
 *    → En Vue.js, c'est comme un store Pinia avec defineStore()
 *
 * 2. HttpClient
 *    → Client HTTP intégré à Angular (pas besoin d'axios !)
 *    → Retourne des Observable<T> au lieu de Promise<T>
 *    → Observable = comme un Promise, mais peut émettre plusieurs valeurs dans le temps
 *    → Pour une requête HTTP simple, ça fonctionne comme une Promise
 *
 * 3. inject(HttpClient)
 *    → Injection de dépendances (Angular injecte automatiquement HttpClient)
 *    → C'est comme @Autowired en Spring Boot
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DescriptionRace } from '../models/description-race.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  // ← Disponible partout (singleton), comme @Service en Spring Boot
})
export class DescriptionRaceService {

  /**
   * Injection de HttpClient via la fonction inject().
   * ➜ Spring Boot : équivalent de @Autowired private RestTemplate restTemplate;
   * ➜ Vue.js : pas d'équivalent direct, tu instancierais axios directement
   */
  private http = inject(HttpClient);

  /** URL de base pour les description-races */
  private baseUrl = `${environment.apiUrl}/description-races`;

  /**
   * Récupérer toutes les descriptions de race.
   * ➜ Appelle GET /api/description-races
   * ➜ Vue.js : axios.get('/api/description-races')
   * ➜ Retourne un Observable<DescriptionRace[]> (typage fort !)
   */
  getAll(): Observable<DescriptionRace[]> {
    return this.http.get<DescriptionRace[]>(this.baseUrl);
  }

  /**
   * Récupérer une description par son ID.
   * ➜ Appelle GET /api/description-races/:id
   */
  getById(id: number): Observable<DescriptionRace> {
    return this.http.get<DescriptionRace>(`${this.baseUrl}/${id}`);
  }

  /**
   * Créer une nouvelle description de race.
   * ➜ Appelle POST /api/description-races avec le body JSON
   * ➜ Vue.js : axios.post('/api/description-races', data)
   */
  create(descriptionRace: DescriptionRace): Observable<DescriptionRace> {
    return this.http.post<DescriptionRace>(this.baseUrl, descriptionRace);
  }

  /**
   * Mettre à jour une description existante.
   * ➜ Appelle PUT /api/description-races/:id avec le body JSON
   */
  update(id: number, descriptionRace: DescriptionRace): Observable<DescriptionRace> {
    return this.http.put<DescriptionRace>(`${this.baseUrl}/${id}`, descriptionRace);
  }

  /**
   * Supprimer une description par son ID.
   * ➜ Appelle DELETE /api/description-races/:id
   * ➜ Retourne Observable<void> car le backend renvoie 204 No Content
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
