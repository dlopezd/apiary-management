// src/app/components/expense-summary/expense-summary.component.ts
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { GetTotalByCostCenterUseCase } from '../../../usecases/get-total-by-cost-center.use-case';
import { CostCenterTotal } from './models/cost-center-total.view-model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-expense-summary',
  templateUrl: './totals-by-cost-center.component.html',
  styleUrls: ['./totals-by-cost-center.component.scss'],
  imports: [ToastModule, ButtonModule, DatePickerModule, TableModule, FormsModule, CurrencyPipe],
  providers: [MessageService], // PrimeNG MessageService
})
export class TotalsByCostCenterReportComponent implements OnInit, OnDestroy {
  private readonly getTotalByCostCenterUseCase = inject(GetTotalByCostCenterUseCase);
  private readonly messageService = inject(MessageService);
  // Modelos para el selector de fechas de PrimeNG
  dateRange: Date[] = [];
  // Total de gastos por centro de costos
  costCenterTotals: CostCenterTotal[] = [];
  loading = false;
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // Inicializa el rango de fechas para el mes actual
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dateRange = [firstDayOfMonth, today];
    this.searchExpenses();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchExpenses(): void {
    if (!this.dateRange[0] || !this.dateRange[1]) {
      return;
    }

    this.loading = true;
    const startDate = this.dateRange[0];
    const endDate = this.dateRange[1];

    this.getTotalByCostCenterUseCase
      .execute(startDate, endDate)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (totals: CostCenterTotal[]) => {
          this.costCenterTotals = totals;
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Totales actualizados correctamente.',
          });
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los datos.',
          });
          console.error('Error fetching totals:', err);
        },
      });
  }
}
