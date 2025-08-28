import { FirestoreReportService } from './infrastructure/domain/services/cost-center/firestore-report.service';
import { REPORT_SERVICE } from './infrastructure/framework/report.token';

export const reportsProviders = [
  {
    provide: REPORT_SERVICE,
    useClass: FirestoreReportService,
  },
];
