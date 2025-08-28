// src/app/components/expense-summary/expense-summary.component.ts
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { GetTotalByCostCenterUAndSeasonseCase } from '../../../usecases/get-total-by-cost-center-and-season.use-case';
import { CostCenterAndSeasonTotal } from './models/cost-center-total.view-model';

@Component({
  selector: 'app-expense-summary',
  templateUrl: './totals-by-cost-center-and-season.component.html',
  styleUrls: ['./totals-by-cost-center-and-season.component.scss'],
  imports: [ToastModule, ButtonModule, DatePickerModule, TableModule, FormsModule, CurrencyPipe],
  providers: [MessageService], // PrimeNG MessageService
})
export class TotalsByCostCenterAndSeasonReportComponent implements OnInit, OnDestroy {
  private readonly getTotalByCostCenterAndSeasonUseCase = inject(
    GetTotalByCostCenterUAndSeasonseCase,
  );
  private readonly messageService = inject(MessageService);
  loading = false;
  private unsubscribe$ = new Subject<void>();
  costCenterAndSeasonTotals: CostCenterAndSeasonTotal[] = [];
  seasons: string[] = [];

  ngOnInit(): void {
    this.searchTotals();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchTotals(): void {
    this.loading = true;

    this.getTotalByCostCenterAndSeasonUseCase
      .execute()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (totals: CostCenterAndSeasonTotal[]) => {
          this.costCenterAndSeasonTotals = totals;
          this.seasons = Array.from(new Set(totals.map((item) => item.season)));
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
