import { Routes } from '@angular/router';
import { CostCenterListComponent } from './features/cost-center-list/cost-center-list.component';

export const COST_CENTER_ROUTES: Routes = [
  {
    path: '',
    component: CostCenterListComponent,
  },
];
