import { Pageable, Sort } from "./Common";

export interface QrData {
    id: number;
    vehicleCard: string;
    qrScanner: string;
    supplierNameBTM: string | null;
    supplierNameHTX: string | null;
    productCode: string;
    productName: string;
    lotId: string;
    lotIdDetail: string;
    lotNumber: string;
    driver1: string | null;
    driver2: string | null;
    driver3: string | null;
    citizenId1: string | null;
    citizenId2: string | null;
    citizenId3: string | null;
    vehicleId: string | null;
    licensePlate: string | null;
    estimatedArrivalTime: string | null;
    note: string | null;
    statusCheckin: boolean;
    status: string;
    createdAt: string;
    sendAI: boolean;
}

export interface QrDataResponse {
  content: QrData[];
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

