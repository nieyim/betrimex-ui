import { Pageable, Sort } from "./Common";

export interface AuditLog {
    id: number;
    username: string,
    action: string,
    resource: string;
    details: string;
    status: string;
    currentJson: string;
    newJson: string;
    createdAt: string;
}

export interface AuditLogResponse {
  content: AuditLog[];
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