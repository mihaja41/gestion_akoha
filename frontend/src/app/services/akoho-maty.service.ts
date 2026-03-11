import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AkohoMaty } from '../models/akoho-maty.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AkohoMatyService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/akoho-maty`;

  getAll(): Observable<AkohoMaty[]> {
    return this.http.get<AkohoMaty[]>(this.baseUrl);
  }

  getById(id: number): Observable<AkohoMaty> {
    return this.http.get<AkohoMaty>(`${this.baseUrl}/${id}`);
  }

  create(item: AkohoMaty): Observable<AkohoMaty> {
    return this.http.post<AkohoMaty>(this.baseUrl, item);
  }

  update(id: number, item: AkohoMaty): Observable<AkohoMaty> {
    return this.http.put<AkohoMaty>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
