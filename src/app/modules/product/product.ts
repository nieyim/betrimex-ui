import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { ProductService } from '../../core/service/product/product.service';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  toDateTimeString,
} from '../../shared/utils/date.util';
import { PageEvent } from '@angular/material/paginator';
import { Product, ProductResponse, ProductSearchParams } from '../../core/model/Product';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialog } from '../../shared/components/dialog/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [Header, CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductPage implements OnInit {
  constructor(private productService: ProductService) {}

  @ViewChild('dateFromRef') dateFromRef!: ElementRef;
  @ViewChild('dateToRef') dateToRef!: ElementRef;

  productData: Product[] = [];
  fromDate: string = getFirstDayOfMonth();
  toDate: string = getLastDayOfMonth();
  isDownloading = false;
  sendingIds: Set<number> = new Set();

  // Pagination & date filters
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const pageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 999,
      length: 999,
    };

    const productParams: ProductSearchParams = {
      fromDate: toDateTimeString(this.fromDate),
      toDate: toDateTimeString(this.toDate, true),
      isSync: true,
    };

    this.productService.searchProduct(pageEvent, productParams).subscribe({
      next: (response: ProductResponse) => {
        this.productData = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách Product:', err);
      },
    });
  }

  resetFilter(): void {
    this.fromDate = getFirstDayOfMonth();
    this.toDate = getLastDayOfMonth();
    this.loadProduct();
  }

  readonly dialog = inject(MatDialog);

  handleExportPDF(productId: string, id: number): void {
    if (this.sendingIds.has(id)) {
      return;
    }

    this.sendingIds.add(id);
    this.isDownloading = true;

    this.productService.exportPDFReport(productId).subscribe({
      next: (response: Blob) => {
        if (!response || response.size === 0) {
          console.error('PDF rỗng hoặc lỗi dữ liệu');
          return;
        }

        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Báo cáo lô dừa.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Export PDF thất bại:', err);
      },
      complete: () => {
        this.sendingIds.delete(id);
        this.isDownloading = false;
      },
    });
  }

  applyFilter(): void {
    if (this.dateFromRef && this.dateToRef) {
      this.fromDate = this.dateFromRef.nativeElement.value;
      this.toDate = this.dateToRef.nativeElement.value;
    }

    this.pageIndex = 0; // Reset to first page when filtering
    this.loadProduct();
  }

  handleExportExcel(): void {
    if (this.isDownloading) {
      return;
    }

    this.isDownloading = true;

    const productParams: ProductSearchParams = {
      fromDate: toDateTimeString(this.fromDate),
      toDate: toDateTimeString(this.toDate, true),
      isSync: true,
    };

    this.productService.exportExcelReport(productParams).subscribe({
      next: (response: Blob) => {
        if (!response || response.size === 0) {
          console.error('Excel file rỗng hoặc lỗi dữ liệu');
          return;
        }

        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Báo_cáo_lô_dừa_${this.fromDate}_${this.toDate}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Export Excel thất bại:', err);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      },
      complete: () => {
        this.isDownloading = false;
      },
    });
  }

  openDialog(id: string) {
    const dialogRef = this.dialog.open(ProductDialog, {
      data: {
        productId: id,
      },
      disableClose: false,
    });
  }

  // ---- PAGINATION METHODS ----
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.loadProduct();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = parseInt(select.value, 10);
    this.pageIndex = 0; // Reset to first page
    this.loadProduct();
  }

  goToFirstPage(): void {
    this.onPageChange(0);
  }

  goToLastPage(): void {
    this.onPageChange(this.totalPages - 1);
  }

  goToPreviousPage(): void {
    this.onPageChange(this.pageIndex - 1);
  }

  goToNextPage(): void {
    this.onPageChange(this.pageIndex + 1);
  }

  // Get page numbers for pagination display
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.pageIndex - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // ---- UTILITY METHODS ----
  get startItem(): number {
    return this.totalItems === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
  }
}
