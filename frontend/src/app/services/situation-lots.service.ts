import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SituationLotsResponse } from '../models/situation-lot.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SituationLotsService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/situation-lots`;

  getSituationByDate(date: string): Observable<SituationLotsResponse> {
    const params = new HttpParams().set('date', date);
    return this.http.get<SituationLotsResponse>(this.baseUrl, { params });
  }
}
