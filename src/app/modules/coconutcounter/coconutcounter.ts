import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';

interface CountingSlip {
  stt: number;
  qrCode: string;
  vehicleCard: string;
  lotNumber: string;
  licensePlate: string;
  supplier: string;
  driver1: string;
  registrationDate: string; // Định dạng YYYY-MM-DD
}

@Component({
  selector: 'app-coconutcounter',
  imports: [CommonModule],
  templateUrl: './coconutcounter.html',
  styleUrl: './coconutcounter.css',
})
export class CoconutCounter {
  private initialData: CountingSlip[] = [
    { stt: 1, qrCode: 'QR20240001', vehicleCard: 'VCX-001', lotNumber: 'L001A', licensePlate: '51C-123.45', supplier: 'Công ty TNHH A', driver1: 'Nguyễn Văn Tài', registrationDate: '2025-11-20' },
    { stt: 2, qrCode: 'QR20240002', vehicleCard: 'VCX-002', lotNumber: 'L002B', licensePlate: '51C-678.90', supplier: 'Hợp tác xã B', driver1: 'Trần Thị Thúy', registrationDate: '2025-11-21' },
    { stt: 3, qrCode: 'QR20240003', vehicleCard: 'VCX-003', lotNumber: 'L001A', licensePlate: '51C-111.22', supplier: 'Công ty TNHH A', driver1: 'Lê Văn Lực', registrationDate: '2025-11-21' },
    { stt: 4, qrCode: 'QR20240004', vehicleCard: 'VCX-004', lotNumber: 'L003C', licensePlate: '51D-333.44', supplier: 'Doanh nghiệp Tư nhân C', driver1: 'Phạm Văn Công', registrationDate: '2025-11-22' },
    { stt: 5, qrCode: 'QR20240005', vehicleCard: 'VCX-005', lotNumber: 'L004D', licensePlate: '51E-555.66', supplier: 'Công ty TNHH A', driver1: 'Võ Thị Thanh', registrationDate: '2025-11-22' },
    { stt: 6, qrCode: 'QR20240006', vehicleCard: 'VCX-006', lotNumber: 'L002B', licensePlate: '51F-777.88', supplier: 'Hợp tác xã B', driver1: 'Đặng Văn Khoa', registrationDate: '2025-11-23' },
    { stt: 7, qrCode: 'QR20240007', vehicleCard: 'VCX-007', lotNumber: 'L001A', licensePlate: '51G-999.00', supplier: 'Doanh nghiệp Tư nhân C', driver1: 'Bùi Thị Lan', registrationDate: '2025-11-23' },
    { stt: 8, qrCode: 'QR20240008', vehicleCard: 'VCX-008', lotNumber: 'L005E', licensePlate: '51H-101.12', supplier: 'Công ty TNHH D', driver1: 'Nguyễn Văn Tài', registrationDate: '2025-11-24' },
    { stt: 9, qrCode: 'QR20240009', vehicleCard: 'VCX-009', lotNumber: 'L003C', licensePlate: '51K-213.14', supplier: 'Công ty TNHH D', driver1: 'Trần Văn Mạnh', registrationDate: '2025-11-24' },
    { stt: 10, qrCode: 'QR20240010', vehicleCard: 'VCX-010', lotNumber: 'L004D', licensePlate: '51L-435.16', supplier: 'Hợp tác xã B', driver1: 'Lê Thị Nga', registrationDate: '2025-11-25' },
    { stt: 11, qrCode: 'QR20240011', vehicleCard: 'VCX-011', lotNumber: 'L001A', licensePlate: '51M-789.01', supplier: 'Công ty TNHH A', driver1: 'Phạm Văn Công', registrationDate: '2025-11-25' },
  ];
  // ------------------------------------

  // --- STATE MANAGEMENT SỬ DỤNG SIGNALS ---
  // Data
  data = signal<CountingSlip[]>([]);
  qrInput = signal<string>('');
  isScanning = signal<boolean>(false);

  // Filter
  filterFromDate = signal<string>('');
  filterToDate = signal<string>('');
  activeFilter = signal<{from: string, to: string} | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);

  // Computed: Dữ liệu đã được lọc (dựa trên activeFilter)
  filteredData = computed(() => {
    const data = this.data();
    const filter = this.activeFilter();

    if (!filter || (!filter.from && !filter.to)) {
      return data;
    }

    const fromDate = filter.from ? new Date(filter.from) : null;
    const toDate = filter.to ? new Date(filter.to) : null;

    // Chuẩn hóa ngày ToDate để bao gồm cả ngày đó (thêm 1 ngày và trừ 1ms)
    const effectiveToDate = toDate
      ? new Date(toDate.getTime() + 24 * 60 * 60 * 1000 - 1)
      : null;

    return data.filter(item => {
      const itemDate = new Date(item.registrationDate);

      let matchesFrom = true;
      if (fromDate) {
        // So sánh chỉ ngày, bỏ qua giờ
        matchesFrom = itemDate.getTime() >= fromDate.getTime();
      }

      let matchesTo = true;
      if (effectiveToDate) {
        matchesTo = itemDate.getTime() <= effectiveToDate.getTime();
      }

      return matchesFrom && matchesTo;
    });
  });

  // Computed: Tổng số mục sau khi lọc
  totalItems = computed(() => this.filteredData().length);

  // Computed: Tổng số trang
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  // Computed: Dữ liệu cho trang hiện tại
  pagedData = computed(() => {
    const data = this.filteredData();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
  });

  // Computed: Tính toán các chỉ số và danh sách trang để hiển thị
  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage());
  endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage(), this.totalItems()));

  pages = computed(() => {
    const total = this.totalPages();
    const pagesArray: number[] = [];
    // Chỉ hiển thị tối đa 5 nút trang
    const maxPagesToShow = 5;
    const current = this.currentPage();

    let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  });

  constructor() {
    // Luôn reset về trang 1 khi filteredData thay đổi (do lọc)
    effect(() => {
      this.filteredData(); // Theo dõi sự thay đổi của filteredData
      this.currentPage.set(1);
    });

  }

  ngOnInit() {
    // Khởi tạo data với mock data
    this.data.set(this.initialData);

    // Thiết lập ngày lọc mặc định là 7 ngày gần nhất
    this.setDefaultFilterDates();
    this.applyDateFilter();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  setDefaultFilterDates(): void {
    const today = new Date();
    const pastSevenDays = new Date(today);
    pastSevenDays.setDate(today.getDate() - 7);

    this.filterToDate.set(this.formatDate(today));
    this.filterFromDate.set(this.formatDate(pastSevenDays));
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  applyDateFilter(): void {
    this.activeFilter.set({
      from: this.filterFromDate(),
      to: this.filterToDate()
    });
  }

  resetFilter(): void {
    this.filterFromDate.set('');
    this.filterToDate.set('');
    this.activeFilter.set(null);
  }

  // --- LOGIC QUÉT QR CODE ---

  toggleScanning(): void {
    this.isScanning.update(val => !val);
    if (!this.isScanning()) {
      // Giả lập kết quả quét sau 1 giây
      setTimeout(() => {
        this.qrInput.set('QR20240005'); // Mã QR mẫu để tra cứu
      }, 1000);
    }
  }

  searchByQr(): void {
    const code = this.qrInput();
    if (code) {
      const foundItem = this.data().find(item => item.qrCode === code);
      if (foundItem) {
        // Trong dự án thật, bạn sẽ điều hướng hoặc hiển thị chi tiết phiếu này.
        console.log("Tìm thấy phiếu:", foundItem);

        // Giả lập: Cập nhật bộ lọc để chỉ hiển thị mục này (hoặc hiển thị trong modal)
        this.data.set([foundItem]);
        this.activeFilter.set(null); // Bỏ lọc ngày khi tra cứu QR
        this.qrInput.set(''); // Xóa input sau khi tìm kiếm
      } else {
        console.log(`Không tìm thấy phiếu với mã QR: ${code}`);
        // Trong dự án thật: Hiển thị thông báo lỗi hoặc modal "Không tìm thấy"
      }
    } else {
      console.log("Vui lòng nhập mã QR để tra cứu.");
    }
  }
}
