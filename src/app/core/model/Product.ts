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

export interface ProductResponse {
  id?: number;
  count?: string;
  supplier?: string;
  quantity?: string;
  coconutType?: string;
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
  qrData?: string;
  createdAt?: string;
}

export class ProductInfoResponse {
  totalProduct: number = 0;
  labels: string[] = [];
  data: number[] = [];
}
