import { Routes } from '@angular/router';
import { ExpenseListComponent } from './features/expense-list/expense-list.component';

export const EXPENSE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ExpenseListComponent,
      },
      // TODO: Add routes for create and edit
    ],
  },
];
