import { FirestoreExpenseService } from './infrastructure/domain/services/expenses';
import { EXPENSE_SERVICE } from './infrastructure/framework/expense.token';

export const expenseProviders = [
  {
    provide: EXPENSE_SERVICE,
    useClass: FirestoreExpenseService,
  },
];
