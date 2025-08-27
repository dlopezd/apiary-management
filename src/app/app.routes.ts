import { Routes } from '@angular/router';
import { authGuard } from '../authentication/infrastructure/framework/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../authentication/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'cost-centers',
    loadChildren: () =>
      import('../cost-center/presentation/cost-center.routes').then((m) => m.COST_CENTER_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'expenses',
    loadChildren: () =>
      import('../expenses/presentation/expense.routes').then((m) => m.EXPENSE_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../reports/presentation/reports.routes').then((m) => m.REPORTS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'cost-centers',
    pathMatch: 'full',
  },
];
