import { InjectionToken } from '@angular/core';
import { ReportService } from '../domain/services/cost-center';

export const REPORT_SERVICE = new InjectionToken<ReportService>('ReportService');
