import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../../core/service/product/product.service';
import { PageEvent } from '@angular/material/paginator';
import { Product, ProductResponse, ProductSearchParams } from '../../../../core/model/Product';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  toDateTimeString,
} from '../../../../shared/utils/date.util';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialog } from '../../../../shared/components/dialog/dialog';

@Component({
  selector: 'app-recentproduct',
  imports: [CommonModule],
  templateUrl: './recentproduct.html',
  styleUrl: './recentproduct.css',
})
export class RecentProduct implements OnInit {
  constructor(private productService: ProductService) {}

  productData: Product[] = [];
  fromDate: string = getFirstDayOfMonth();
  toDate: string = getLastDayOfMonth();
  isDownloading = false;
  sendingIds: Set<number> = new Set();

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
        console.log(this.productData);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách Product:', err);
      },
    });
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

  handleExportExcel () {
    
  }

  openDialog(id: string) {
    const dialogRef = this.dialog.open(ProductDialog, {
      data: {
        productId: id,
      },
      disableClose: false,
    });
  }
}
