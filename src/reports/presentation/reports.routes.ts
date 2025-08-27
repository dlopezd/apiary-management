import { Routes } from '@angular/router';
import { TotalsByCostCenterReportComponent } from './features/totals-by-cost-center/totals-by-cost-center.component';

export const REPORTS_ROUTES: Routes = [
  {
    path: 'totalized-cost-center',
    component: TotalsByCostCenterReportComponent,
  },
];
