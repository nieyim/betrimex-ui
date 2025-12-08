import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { CoconutCounterService } from '../../core/service/coconutcounter/counter.service';
import { CommonModule } from '@angular/common';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  toDateTimeString,
} from '../../shared/utils/date.util';
import { PageEvent } from '@angular/material/paginator';
import { QrData, QrDataResponse, QrDataSearchParams } from '../../core/model/QrData';

@Component({
  selector: 'app-coconutcounter',
  imports: [CommonModule],
  templateUrl: './coconutcounter.html',
  styleUrl: './coconutcounter.css',
})
export class CoconutCounter {
  // ----  SIGNALS & VARIABLES ----
  // Init values
  qrInput = signal<string>('');
  qrData: QrData[] = [];
  isLoading = signal<boolean>(false);
  isScanning = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Pagination & date filters
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  @ViewChild('qrInputRef') qrInputRef!: ElementRef;
  @ViewChild('dateFromRef') dateFromRef!: ElementRef;
  @ViewChild('dateToRef') dateToRef!: ElementRef;

  // Default date range -> today
  fromDate: string = getFirstDayOfMonth();
  toDate: string = getLastDayOfMonth();

  constructor(private coconutCounterService: CoconutCounterService) {}

  ngOnInit(): void {
    this.loadQrData();
  }

  // ---- LOGIC ----

  // Load QrData

  loadQrData(): void {
    this.isLoading.set(true);
    const pageEvent: PageEvent = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.totalItems,
    };

    const searchQr: QrDataSearchParams = {
      fromDate: toDateTimeString(this.fromDate),
      toDate: toDateTimeString(this.toDate, true),
    };

    console.log('Loading QR data with params:', pageEvent, searchQr);

    this.coconutCounterService.getQr(pageEvent, searchQr).subscribe({
      next: (response: QrDataResponse) => {
        this.qrData = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách QR:', err);
        this.isLoading.set(false);
      },
    });
  }

  // Handle QR code submission
  handleSubmitQrCode(qrTextJson: string): void {
    if (!qrTextJson) {
      alert('Vui lòng nhập mã QR hợp lệ.');
      return;
    }

    this.isSubmitting.set(true);

    this.coconutCounterService.uploadQrTextJson(qrTextJson).subscribe({
      next: (response: string) => {
        alert(response);
        this.loadQrData();
        this.isSubmitting.set(false);
      },
      error: (error: any) => {
        console.error('Error sending QR data:', error);
        alert('An error occurred while sending QR data. Please try again.');
        this.isSubmitting.set(false);
      },
    });
  }

  // Scan QR code
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.isScanning.set(false);
      // Optionally: this.handleSubmitQrCode(this.qrInput());
    }
  }

  // Enable scanning mode and focus input
  toggleScanning() {
    this.isScanning.set(true);
    this.qrInput.set('');

    setTimeout(() => {
      this.qrInputRef.nativeElement.focus();
    });
  }

  // ---- PAGINATION METHODS ----
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.loadQrData();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = parseInt(select.value, 10);
    this.pageIndex = 0; // Reset to first page
    this.loadQrData();
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

  // ---- FILTER METHODS ----
  applyFilter(): void {
    if (this.dateFromRef && this.dateToRef) {
      this.fromDate = this.dateFromRef.nativeElement.value;
      this.toDate = this.dateToRef.nativeElement.value;
    }

    this.pageIndex = 0; // Reset to first page when filtering
    this.loadQrData();
  }

  clearFilter(): void {
    this.fromDate = getFirstDayOfMonth();
    this.toDate = getLastDayOfMonth();

    if (this.dateFromRef && this.dateToRef) {
      this.dateFromRef.nativeElement.value = this.fromDate;
      this.dateToRef.nativeElement.value = this.toDate;
    }

    this.pageIndex = 0;
    this.loadQrData();
  }

  // ---- UTILITY METHODS ----
  get startItem(): number {
    return this.totalItems === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
  }
}
