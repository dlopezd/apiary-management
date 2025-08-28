import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Expense } from '../../../infrastructure/domain/services/expenses';
import { EXPENSE_SERVICE } from '../../../infrastructure/framework/expense.token';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, Button, TableModule],
  templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent {
  private readonly expensesService = inject(EXPENSE_SERVICE);

  expenses = toSignal(this.expensesService.list());

  deleteExpense(id: string): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expensesService.delete(id).subscribe({
        next: () => {
          // Refresh the list after deletion
          this.expenses = toSignal(this.expensesService.list());
        },
      });
    }
  }

  loadExpenses(): void {
    const expenses: Expense[] = [
      //  {
      //   id: '1',
      //   description: 'Arriendo helicoptero piso',
      //   amount: 45000,
      //   date: new Date('2025-07-15'),
      //   costCenter: { id: 'Sm11hNQtCT4eIHoAsG90', name: 'Sala Cosecha' },
      //   season: '2025-26',
      // },
    ];
    expenses.forEach((expense) => {
      this.expensesService.create(expense).subscribe();
    });
  }
}
