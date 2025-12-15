import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../core/service/product/product.service';
import { Product } from '../../../core/model/Product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class ProductDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: string },
    private dialogRef: MatDialogRef<ProductDialog>,
    private productService: ProductService
  ) {}

  product: Product = {};

  ngOnInit(): void {
    this.showProductDetail();
  }

  showProductDetail() {
    this.productService.getProductById(this.data.productId).subscribe({
      next: (response: Product) => {
        this.product = response
        console.log(this.product)
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin Product:', err);
      },
    })
  }

  close() {
    this.dialogRef.close();
  }
}
