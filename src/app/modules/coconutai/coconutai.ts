import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CoconutCounterService } from '../../core/service/coconutcounter/counter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coconutai',
  imports: [CommonModule],
  templateUrl: './coconutai.html',
  styleUrl: './coconutai.css',
})
export class CoconutAI {
  // ----  SIGNALS & VARIABLES ----
  // Init values
  qrInput = signal<string>('');
  isLoading = signal<boolean>(false);
  isScanning = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  status = signal<'idle' | 'counting' | 'paused' | 'stopped'>('idle');
  count = signal<number>(0);

  // Timer Logic
  private tickCount = 0;
  timerSeconds = signal<number>(0);
  private timerInterval: any = null;
  formattedTime = computed(() => {
    const totalSeconds = this.timerSeconds();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  @ViewChild('qrInputRef') qrInputRef!: ElementRef;

  constructor(private coconutCounterService: CoconutCounterService) {}

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

  // Timer & Counting Control Functions
  startCounting() {
    if (this.status() === 'counting') return;
    this.status.set('counting');
    this.timerInterval = setInterval(() => {
      // Tăng tick mỗi 200ms
      this.tickCount++;
      this.timerSeconds.set(Math.floor(this.tickCount * 0.2));
      if (Math.random() > 0.7) {
        this.count.update((c) => c + this.getRandomInt(1, 5));
      }
    }, 200);
  }

  getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  pauseCounting() {
    this.status.set('paused');
    this.clearTimer();
  }

  stopCounting() {
    this.status.set('stopped');
    this.clearTimer();
    // Optional: Reset timer?
    this.timerSeconds.set(0);
    this.count.set(0);
    this.tickCount = 0; 
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
