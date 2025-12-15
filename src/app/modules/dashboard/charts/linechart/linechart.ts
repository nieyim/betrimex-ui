import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { QrData } from '../../../../core/model/QrData';

Chart.register(...registerables);

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.html',
  styleUrls: ['./linechart.css'],
  imports: [CommonModule],
})
export class Linechart implements OnChanges {
  chart: any;

  @Input() qrData: QrData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['qrData'] && this.qrData?.length) {
      this.loadChartData();
    }
  }

  loadChartData() {
    const grouped = this.groupByDay(this.qrData);

    // Sort ngày tăng dần
    const labels = Object.keys(grouped).sort();
    const data = labels.map((day) => grouped[day]);

    this.renderChart(labels, data);
  }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) this.chart.destroy();

    const lineColor = 'rgb(132, 204, 22)';
    const fillColor = 'rgba(132, 204, 22, 0.25)';

    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Số lượt quét',
            data,
            borderColor: lineColor,
            backgroundColor: fillColor,
            borderWidth: 2,
            tension: 0.4,
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
            text: 'Số phiếu quét',
            font: { size: 18, weight: 'bold' },
            color: '#374151',
            padding: { top: 10, bottom: 20 },
          },
          legend: { display: false },
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
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
            },
          },
        },
      },
    });
  }

  groupByDay(data: QrData[]) {
    const map: Record<string, number> = {};

    data.forEach((item) => {
      if (!item.createdAt) return;

      const d = new Date(item.createdAt);
      const day = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
        .getDate()
        .toString()
        .padStart(2, '0')}`;

      map[day] = (map[day] || 0) + 1;
    });

    return map;
  }
}
