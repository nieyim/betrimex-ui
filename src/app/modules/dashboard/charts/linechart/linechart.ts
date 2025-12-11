import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { CoconutCounterService } from '../../../../core/service/coconutcounter/counter.service';
import { QrDataResponse } from '../../../../core/model/QrData';

Chart.register(...registerables);

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.html',
  styleUrls: ['./linechart.css'],
  imports: [CommonModule],
})
export class Linechart implements OnInit {
  chart: any;
  currentMode: string = 'week';

  dataInfo!: QrDataResponse;

  constructor(private qrDataService: CoconutCounterService) {}

  ngOnInit(): void {
    // this.loadChartData('week');
  }

  // loadChartData(mode: string) {
  //   this.currentMode = mode;

  //   let apiCall;

  //   if (mode === 'week') apiCall = this.qrDataService.getQrInfoByWeek();
  //   else if (mode === 'month') apiCall = this.qrDataService.getQrInfoByMonth();
  //   else apiCall = this.qrDataService.getQrInfoByYear();

  //   apiCall.subscribe((res: QrDataInfoResponse) => {
  //     this.dataInfo = res;
  //     console.log(this.dataInfo);
  //     this.renderChart(res.labels, res.data);
  //   });
  // }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) this.chart.destroy();

    let chartTitle = '';
    switch (this.currentMode) {
      case 'week':
        chartTitle = 'Số lượt quét QR theo Ngày trong Tuần';
        break;
      case 'month':
        chartTitle = 'Số lượt quét QR theo Tuần trong Tháng';
        break;
      case 'year':
        chartTitle = 'Số lượt quét QR theo Tháng trong Năm';
        break;
    }

    const lineColor = 'rgb(132, 204, 22)'; // lime-500
    const fillColor = 'rgba(132, 204, 22, 0.25)';

    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Số lượt quét',
            data: data,
            borderColor: lineColor,
            backgroundColor: fillColor,
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: lineColor,
            fill: true,
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
            font: { size: 18, weight: 'bold' },
            color: '#374151',
            padding: { top: 10, bottom: 20 },
          },
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(55, 65, 81, 0.9)',
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed.y ?? 0; // nếu null → 0
                return 'Số lượt: ' + new Intl.NumberFormat('vi-VN').format(value);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6b7280',
              callback: (v) => new Intl.NumberFormat('vi-VN').format(v as number),
            },
            grid: { color: 'rgba(200, 200, 200, 0.2)' },
          },
          x: {
            ticks: { color: '#6b7280' },
            grid: { display: false },
          },
        },
      },
    });
  }
}
