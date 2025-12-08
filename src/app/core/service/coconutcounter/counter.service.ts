import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { QrDataResponse, QrDataSearchParams } from '../../model/QrData';

@Injectable({
  providedIn: 'root',
})
export class CoconutCounterService {
  constructor(private httpClient: HttpClient) {}
  private readonly baseUrl = 'http://localhost:8080/api/v1/qr';

  getQr(pageEvent: PageEvent, searchParams: QrDataSearchParams): Observable<QrDataResponse> {
    let params = new HttpParams()
      .set('page', pageEvent.pageIndex.toString())
      .set('size', pageEvent.pageSize.toString());

    return this.httpClient.post<QrDataResponse>(`${this.baseUrl}/search-params`, searchParams, {
      params: params,
    });
  }

  uploadQrTextJson(qrTextJson: string): Observable<string> {
    const formData = new FormData();

    formData.append('qrTextJson', qrTextJson);

    return this.httpClient.post(`${this.baseUrl}/upload`, formData, {
      responseType: 'text',
    });
  }
}
