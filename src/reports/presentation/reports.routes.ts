import { Routes } from '@angular/router';
import { TotalsByCostCenterReportComponent } from './features/totals-by-cost-center/totals-by-cost-center.component';
import { TotalsByCostCenterAndSeasonReportComponent } from './features/totals-by-cost-center-and-season/totals-by-cost-center-and-season.component';

export const REPORTS_ROUTES: Routes = [
  {
    path: 'totalized-cost-center',
    component: TotalsByCostCenterReportComponent,
  },
  {
    path: 'totalized-cost-center-and-season',
    component: TotalsByCostCenterAndSeasonReportComponent,
  },
];
