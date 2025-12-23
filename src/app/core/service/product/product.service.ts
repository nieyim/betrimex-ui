import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProductRequest, ProductResponse, ProductInfoResponse, ProductSearchParams, Product } from '../../model/Product';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SearchParams } from '../../model/Common';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}
  private readonly baseUrl = 'http://localhost:8080/api/v1/products';

  searchProduct(pageEvent: PageEvent, searchParams: ProductSearchParams): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', pageEvent.pageIndex.toString())
      .set('size', pageEvent.pageSize.toString());

    return this.httpClient.post<ProductResponse>(`${this.baseUrl}/search-params`, searchParams, {
      params: params,
    });
  }

  exportExcelReport(searchParams: SearchParams): Observable<Blob> {
     return this.httpClient.post(`${this.baseUrl}/printExcel`, searchParams, {
      responseType: 'blob'
    });
  }

  exportPDFReport(id: string): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}/printPDF/${id}`, {
      responseType: 'blob'
    });
  }

  createProduct(product: CreateProductRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, product);
  }

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductByLotId(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/lots/${id}`);
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
