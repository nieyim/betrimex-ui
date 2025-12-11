import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProductRequest, ProductResponse, ProductInfoResponse } from '../../model/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}
  private readonly baseUrl = 'http://localhost:8080/api/v1/products';

  createProduct(product: CreateProductRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, product);
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.baseUrl}/${id}`);
  }

  getProductByLotId(id: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.baseUrl}/lots/${id}`);
  }

  getProductInfoByWeek(): Observable<ProductInfoResponse> {
    return this.httpClient.post<ProductInfoResponse>(`${this.baseUrl}/get-product-by-week`, {});
  }

  getProductInfoByMonth(): Observable<ProductInfoResponse> {
    return this.httpClient.post<ProductInfoResponse>(`${this.baseUrl}/get-product-by-month`, {});
  }

  getProductInfoByYear(): Observable<ProductInfoResponse> {
    return this.httpClient.post<ProductInfoResponse>(`${this.baseUrl}/get-product-by-year`, {});
  }
}
