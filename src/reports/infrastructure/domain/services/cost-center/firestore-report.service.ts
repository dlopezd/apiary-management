import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import {
  doc,
  DocumentReference,
  getAggregateFromServer,
  query,
  sum,
  where,
} from 'firebase/firestore';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { CostCenter } from '../../../../../cost-center/infrastructure/domain/services/cost-center';
import { COST_CENTER_SERVICE } from '../../../../../cost-center/infrastructure/framework/cost-center.token';
import { Expense } from '../../../../../expenses/infrastructure/domain/services/expenses';
import { EXPENSE_SERVICE } from '../../../../../expenses/infrastructure/framework/expense.token';
import { SEASONS } from '../../../../../shared';
import { CostCentersTotalized } from './models/cost-center-totalized.model';
import { ReportService } from './report.service.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreReportService implements ReportService {
  private firestore = inject(Firestore);
  private expensesService = inject(EXPENSE_SERVICE);
  private costCenterService = inject(COST_CENTER_SERVICE);

  getTotalByCostCenter(startDate: Date, endDate: Date): Observable<CostCentersTotalized> {
    return this.expensesService.listByDateRange(startDate, endDate).pipe(
      map((expenses: Expense[]) => {
        const totals: { [key: string]: number } = {};
        for (const expense of expenses) {
          console.log(expense);
          const costCenterId = expense.costCenter.id;
          if (!totals[costCenterId]) {
            totals[costCenterId] = 0;
          }
          totals[costCenterId] += expense.amount;
        }
        return totals;
      }),
    );
  }

  /**
   * Obtiene la suma total de gastos para una combinación específica de centro de costos y temporada.
   * @param costCenterId La referencia al documento del centro de costos.
   * @param season La temporada (e.g., 'Verano', 'Invierno').
   * @returns Una promesa con el total de gastos para esa combinación.
   */
  private getSumForCombination(costCenterId: string, season: string): Observable<number> {
    const expensesCollection = collection(this.firestore, 'expenses');
    const costCenterRef: DocumentReference<CostCenter> = doc(
      this.firestore,
      `cost-centers/${costCenterId}`,
    ) as DocumentReference<CostCenter>;

    const q = query(
      expensesCollection,
      where('costCenter', '==', costCenterRef),
      where('season', '==', season),
    );
    const aggregates = {
      totalAmount: sum('amount'),
    };

    // Use getAggregateFromServer on the query.
    return from(getAggregateFromServer(q, aggregates)).pipe(
      map((snapshot) => snapshot.data().totalAmount || 0),
    );
  }

  /**
   * Obtiene los totales de gastos por la dupla centro de costo y temporada.
   * @returns Un Observable con un objeto que contiene los totales.
   */
  getTotalsByCostCenterAndSeason(): Observable<
    { season: string; costCenter: CostCenter; total: number }[]
  > {
    const seasons = Object.keys(SEASONS);
    return this.costCenterService.list().pipe(
      switchMap((costCenters: CostCenter[]) => {
        // Step 1: Create an array of observables.
        // We map over the cost centers and seasons to create an observable for each combination.
        const totalObservables = costCenters.flatMap((costCenter) =>
          seasons.map((season) =>
            this.getSumForCombination(costCenter.id, season).pipe(
              map((total) => ({
                season,
                costCenter,
                total,
              })),
            ),
          ),
        );
        // Step 2: Use forkJoin to execute all observables in parallel.
        return forkJoin(totalObservables);
      }),
    );
  }
}
