import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../../../core/service/audit/auditlog.service';
import { PageEvent } from '@angular/material/paginator';
import { SearchParams } from '../../../../core/model/Common';
import {
  toDateTimeString,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from '../../../../shared/utils/date.util';
import { AuditLog, AuditLogResponse } from '../../../../core/model/Audit';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-auditlog',
  imports: [DatePipe],
  templateUrl: './auditlog.html',
  styleUrl: './auditlog.css',
})
export class Auditlog implements OnInit {
  auditData: AuditLog[] = [];

  constructor(private auditlogService: AuditLogService) {}

  ngOnInit(): void {
    this.loadAuditLog();
  }

  loadAuditLog() {
    const pageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 999,
      length: 0,
    };

    const searchAudit: SearchParams = {
      fromDate: toDateTimeString(getFirstDayOfMonth()),
      toDate: toDateTimeString(getLastDayOfMonth(), true),
    };

    this.auditlogService.searchAuditLog(pageEvent, searchAudit).subscribe({
      next: (response: AuditLogResponse) => {
        this.auditData = response.content
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      },
    });
  }
}
