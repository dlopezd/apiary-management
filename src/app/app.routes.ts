import { Routes } from '@angular/router';
import { authGuard } from '../authentication/infrastructure/framework/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../authentication/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../presentation/features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
