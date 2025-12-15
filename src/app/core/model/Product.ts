import { Pageable, Sort } from "./Common";
import { QrData } from "./QrData";

export class CreateProductRequest {
  company?: string | null;
  machineId?: string | null;
  lotId?: string | null;
  factory?: string | null;
  lotIdDetail?: string | null;
  lotNumber?: string | null;
  redCardLot?: string | null;
  vehiclePlate?: string | null;
  quantity?: number = 0;
  countType?: string | null;
  videoPath?: string | null;
  videoTransferPath?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  warehouseStaff?: string | null;
  qrData?: number;
}

export interface Product {
  id?: string;
  count?: string;
  supplier?: string;
  quantity?: string;
  countType?: string;
  region?: string;
  startImgPath?: string;
  endImgPath?: string;
  videoPath?: string;
  startTime?: string;
  endTime?: string;
  lotNumber?: string;
  vehiclePlate?: string;
  purchaseOrderCode?: string;
  warehouseStaff?: string;
  isFinished?: string;
  isSendToServer?: string;
  isSendToCloud?: string;
  qrData?: QrData;
  createdAt?: string;
}

export interface ProductResponse {
  content: Product[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export class ProductInfoResponse {
  totalProduct: number = 0;
  labels: string[] = [];
  data: number[] = [];
}

export interface ProductSearchParams {
  fromDate: string;
  toDate: string;
  isSync: boolean;
}
