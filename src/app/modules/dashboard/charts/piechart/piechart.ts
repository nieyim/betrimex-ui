import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { QrData } from '../../../../core/model/QrData';

Chart.register(...registerables);

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.html',
  styleUrls: ['./piechart.css'],
  imports: [CommonModule],
})
export class Piechart implements OnChanges {
  @Input() qrData: QrData[] = [];
  chart: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['qrData'] && this.qrData?.length) {
      this.loadChart();
    }
  }

  loadChart() {
    const { labels, data } = this.groupBySupplier(this.qrData);

    this.renderChart(labels, data);
  }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Tỷ lệ theo nhà cung cấp',
            data,
            backgroundColor: [
              '#a3e635', // lime-400
              '#bef264', // lime-300
              '#4ade80', // green-400
              '#22d3ee', // cyan-400
              '#fb7185',
              '#fdba74', // orange-300
              '#c084fc', // purple-300
            ],
            borderWidth: 1,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 10,
            left: 10,
            top: 10,
            bottom: 10,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
            },
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { size: 12 },
              padding: 15,
            },
          },
        },
      },
    });
  }

  /** Group theo supplierNameBTM và tính % */
  groupBySupplier(data: QrData[]) {
    const map: Record<string, number> = {};

    data.forEach((item) => {
      const supplier = item.supplierNameBTM || 'Không xác định';

      map[supplier] = (map[supplier] || 0) + 1;
    });

    const total = Object.values(map).reduce((a, b) => a + b, 0);

    const labels = Object.keys(map);
    const percentData = Object.values(map).map((count) => Math.round((count / total) * 100));

    return { labels, data: percentData };
  }
}
