import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProductService } from '../../../../core/service/product/product.service';
import { ProductInfoResponse } from '../../../../core/model/Product';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.html', 
  imports: [CommonModule],
  styleUrls: ['./barchart.css'], 
})
export class Barchart implements OnInit {
  chart: any;
  currentMode: string = 'week';

  dataInfo!: ProductInfoResponse; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadChartData('week');
  }

  loadChartData(mode: string) {
    this.currentMode = mode;

    let apiCall;

    if (mode === 'week') apiCall = this.productService.getProductInfoByWeek();
    else if (mode === 'month') apiCall = this.productService.getProductInfoByMonth();
    else apiCall = this.productService.getProductInfoByYear();

    apiCall.subscribe((res: ProductInfoResponse) => {
      this.dataInfo = res; 
      console.log(this.dataInfo)
      this.renderChart(res.labels, res.data);
    });
  }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy(); 
    }

    let chartTitle = '';
    switch (this.currentMode) {
      case 'week':
        chartTitle = 'Tổng số dừa theo Ngày trong Tuần';
        break;
      case 'month':
        chartTitle = 'Tổng số dừa theo Tuần trong Tháng';
        break;
      case 'year':
        chartTitle = 'Tổng số dừa theo Tháng trong Năm';
        break;
    }

    // Màu lime-500 của Tailwind: #84cc16
    const backgroundColor = 'rgba(132, 204, 22, 0.8)'; // lime-500 với độ trong suốt 0.8
    const borderColor = 'rgb(132, 204, 22)'; // lime-500
    const hoverBackgroundColor = 'rgba(190, 242, 100, 0.9)'; // lime-300 sáng hơn khi hover

    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Số lượng dừa',
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 0, 
            hoverBackgroundColor: hoverBackgroundColor, 
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#374151', // gray-700
            padding: {
              top: 10,
              bottom: 30
            }
          },
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(55, 65, 81, 0.9)', 
            titleFont: { weight: 'bold' },
            bodyFont: { weight: 'normal' },
            padding: 10,
            caretPadding: 5,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' trái'; 
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.2)',
            },
            ticks: {
                color: '#6b7280', // gray-500
                callback: (value) => new Intl.NumberFormat('vi-VN').format(value as number), 
            }
          },
          x: {
            grid: {
              display: false, 
            },
            ticks: {
                color: '#6b7280', // gray-500
            }
          }
        },
      },
    });
  }
}