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

  openDialog(id: string) {
    const dialogRef = this.dialog.open(ProductDialog, {
      data: {
        productId: id,
      },
    });
  }
}
