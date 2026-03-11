import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LotAtody } from '../models/lot-atody.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LotAtodyService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/lots-atody`;

  getAll(): Observable<LotAtody[]> {
    return this.http.get<LotAtody[]>(this.baseUrl);
  }

  getById(id: number): Observable<LotAtody> {
    return this.http.get<LotAtody>(`${this.baseUrl}/${id}`);
  }

  create(item: LotAtody): Observable<LotAtody> {
    return this.http.post<LotAtody>(this.baseUrl, item);
  }

  update(id: number, item: LotAtody): Observable<LotAtody> {
    return this.http.put<LotAtody>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
