import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SearchParams } from '../../model/Common';
import { Observable } from 'rxjs';
import { AuditLogResponse } from '../../model/Audit';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  constructor(private httpClient: HttpClient) {}
  private readonly baseUrl = 'http://localhost:8080/api/v1/logs';
  
  searchAuditLog(pageEvent: PageEvent, searchParams: SearchParams): Observable<AuditLogResponse> {
    let params = new HttpParams()
      .set('page', pageEvent.pageIndex.toString())
      .set('size', pageEvent.pageSize.toString());

    return this.httpClient.post<AuditLogResponse>(`${this.baseUrl}/search-params`, searchParams, {
      params: params,
    });
  }
}
