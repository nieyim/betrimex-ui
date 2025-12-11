import { Component, computed, ElementRef, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoconutCounterService } from '../../core/service/coconutcounter/counter.service';
import { QrData } from '../../core/model/QrData';
import { ProductService } from '../../core/service/product/product.service';
import { CreateProductRequest } from '../../core/model/Product';
import { AuthService } from '../../core/service/auth/auth.service';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-coconutai',
  imports: [CommonModule, Header],
  templateUrl: './coconutai.html',
  styleUrl: './coconutai.css',
})
export class CoconutAI implements OnInit {
  // -------------------------------
  // SIGNAL STATE
  // -------------------------------
  qrInput = signal<string>('');
  currentQR = signal<QrData | undefined>(undefined);
  isSubmitting = signal(false);
  isScanning = signal(false);
  status = signal<'idle' | 'counting' | 'paused' | 'stopped'>('idle');

  count = signal(0); // số lượng dừa đếm được
  timerSeconds = signal(0); // thời gian đếm (s)

  scannedQrList: QrData[] = [];

  startTime: Date | null = null;
  endTime: Date | null = null;

  private tickCount = 0;
  private timerInterval: any = null;

  formattedTime = computed(() => {
    const total = this.timerSeconds();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(
      total % 60
    )}`;
  });

  @ViewChild('qrInputRef') qrInputRef!: ElementRef;

  constructor(
    private coconutCounterService: CoconutCounterService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  // ============================================================
  // FIX BUG RELOAD → SYNC BACKEND
  // ============================================================
  ngOnInit() {
    // Nếu reload mà FE còn giữ scannedQrList → validate với BE
    if (this.scannedQrList.length > 0) {
      const savedLot = this.scannedQrList[0].lotId;

      this.productService.getProductByLotId(savedLot).subscribe({
        next: () => {
          // Backend có product → lô đã đếm xong
          this.status.set('stopped');
        },
        error: () => {
          // Backend KHÔNG có → FE giữ state ảo → reset toàn bộ
          this.resetStateAfterReload();
        },
      });
    }
  }

  private resetStateAfterReload() {
    this.scannedQrList = [];
    this.currentQR.set(undefined);

    this.count.set(0);
    this.timerSeconds.set(0);
    this.tickCount = 0;

    this.startTime = null;
    this.endTime = null;

    this.clearTimer();
    this.status.set('idle');
  }

  // ===================================================================
  // SUBMIT QR
  // ===================================================================
  handleSubmitQrCode(qrTextJson: string): void {
    if (!qrTextJson) {
      alert('Vui lòng nhập mã QR hoặc quét mã.');
      return;
    }

    this.isSubmitting.set(true);

    this.coconutCounterService.uploadQrTextJsonTesting(qrTextJson).subscribe({
      next: (res: any) => {
        const raw = typeof res === 'string' ? JSON.parse(res) : res;
        const parsed = raw.data;

        if (!parsed) {
          alert(raw.message || 'QR không hợp lệ');
          this.isSubmitting.set(false);
          return;
        }

        const newLotId = parsed.lotId ?? null;
        const currentLotId = this.scannedQrList[0]?.lotId ?? null;
        const currentStatus = this.status();

        if (currentStatus === 'counting' || currentStatus === 'paused') {
          if (newLotId && newLotId === currentLotId) {
            this.mergeVehicleInfo(parsed);
            alert('Đã cập nhật thêm thông tin xe vào lô đang đếm.');
          } else {
            alert('Không thể nhập lô khác khi đang đếm. Vui lòng hoàn tất lô hiện tại trước.');
            this.isSubmitting.set(false);
            return;
          }
        } else {
          if (newLotId && newLotId !== currentLotId) {
            this.resetLotData();
            this.scannedQrList = [parsed];
            alert('Đã chuyển sang lô mới.');
          } else if (newLotId && newLotId === currentLotId) {
            this.mergeVehicleInfo(parsed);
          } else {
            this.scannedQrList = [parsed];
          }

          this.currentQR.set({ ...this.scannedQrList[0] });
        }

        this.isSubmitting.set(false);
      },

      error: (err) => {
        let msg = 'Lỗi xử lý QR.';
        try {
          const parsed = JSON.parse(err.error);
          msg = parsed.message || msg;
        } catch {}
        alert(msg);
        this.isSubmitting.set(false);
      },
    });
  }

  // Merge Lot
  private mergeVehicleInfo(newQrData: QrData): void {
    const existing = this.scannedQrList[0];

    if (newQrData.licensePlate && !existing.licensePlate?.includes(newQrData.licensePlate)) {
      existing.licensePlate = (existing.licensePlate || '') + `, ${newQrData.licensePlate}`;
    }

    this.currentQR.set({ ...existing });
  }

  // Reset Lot
  private resetLotData(): void {
    this.count.set(0);
    this.timerSeconds.set(0);
    this.tickCount = 0;
    this.startTime = null;
    this.endTime = null;
    this.clearTimer();
    this.status.set('idle');
  }

  // ===================================================================
  // SCANNING MODE
  // ===================================================================
  toggleScanning() {
    this.isScanning.set(true);
    this.qrInput.set('');
    setTimeout(() => this.qrInputRef.nativeElement.focus(), 0);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.isScanning.set(false);
      this.handleSubmitQrCode(this.qrInput());
    }
  }

  // ===================================================================
  // COUNTING LOGIC
  // ===================================================================
  startCounting() {
    if (!this.currentQR()) {
      alert('Chưa có QR hợp lệ để bắt đầu đếm!');
      return;
    }

    if (this.status() === 'counting') return;

    const qr = this.currentQR()!;
    this.productService.getProductByLotId(qr.lotId).subscribe({
      next: (existingProduct) => {
        if (existingProduct) {
          alert('Lô này đã hoàn tất đếm, vui lòng kiểm tra lại thông tin.');
          return;
        } else {
          this.beginCounting();
        }
      },
      error: () => {
        this.beginCounting();
      },
    });
  }

  private beginCounting() {
    this.status.set('counting');
    this.startTime = new Date();
    this.startVideo();

    this.timerInterval = setInterval(() => {
      this.tickCount++;
      this.timerSeconds.set(Math.floor(this.tickCount * 0.2));

      if (Math.random() > 0.7) {
        this.count.update((c) => c + this.getRandomInt(1, 4));
      }
    }, 200);
  }

  pauseCounting() {
    this.status.set('paused');
    this.stopVideo();
    this.clearTimer();
  }

  stopCounting() {
    if (!this.currentQR()) return;

    // trạng thái tạm khi lưu
    this.endTime = new Date();
    this.clearTimer();

    const qr = this.currentQR()!;
    const payload: CreateProductRequest = {
      machineId: 'Machine-01',
      factory: '1100',
      lotId: qr.lotId,
      lotNumber: qr.lotNumber,
      lotIdDetail: qr.lotIdDetail,
      vehiclePlate: qr.licensePlate,
      quantity: this.count(),
      startTime: this.formatDate(this.startTime!),
      endTime: this.formatDate(this.endTime!),
      warehouseStaff: this.authService.currentUsername(),
      qrData: qr.id,
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        alert('Đã lưu lô thành công!');
        this.status.set('stopped');
      },
      error: () => {
        alert('Lỗi khi lưu lô, vui lòng thử lại.');

        // rollback về trạng thái đang đếm
        this.status.set('counting');
      },
    });
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  // Video
  @ViewChild('cameraVideo') cameraVideo!: ElementRef<HTMLVideoElement>;

  isPlaying = false;
  videoSrc = 'assets/videos/coconut.mp4';

  startVideo() {
    this.isPlaying = true;
  }

  stopVideo() {
    this.isPlaying = false;
  }

  onVideoEnded() {
    // Loop thủ công để controller bởi code
    const video = this.cameraVideo.nativeElement;
    video.currentTime = 0;
    video.play();
  }
}
