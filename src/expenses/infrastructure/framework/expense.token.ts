import { InjectionToken } from '@angular/core';
import { ExpenseService } from '../domain/services/expenses';

export const EXPENSE_SERVICE = new InjectionToken<ExpenseService>('EXPENSE_SERVICE');
