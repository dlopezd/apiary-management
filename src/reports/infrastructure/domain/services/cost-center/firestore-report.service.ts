import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import {
  doc,
  DocumentReference,
  getAggregateFromServer,
  query,
  sum,
  Timestamp,
  where,
} from 'firebase/firestore';
import { forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { CostCenter } from '../../../../../cost-center/infrastructure/domain/services/cost-center';
import { COST_CENTER_SERVICE } from '../../../../../cost-center/infrastructure/framework/cost-center.token';
import { SEASONS } from '../../../../../shared';
import { CostCentersTotalized } from './models/cost-center-totalized.model';
import { ReportService } from './report.service.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreReportService implements ReportService {
  private firestore = inject(Firestore);
  private costCenterService = inject(COST_CENTER_SERVICE);

  getTotalByCostCenter(startDate: Date, endDate: Date): Observable<CostCentersTotalized> {
    // 1. Obtener todos los centros de costo
    return this.costCenterService.list().pipe(
      switchMap((costCenters: CostCenter[]) => {
        if (costCenters.length === 0) {
          return of({}); // No hay centros de costo, no hay totales.
        }

        // 2. Para cada centro de costo, crear un observable de consulta de agregación
        const totalObservables$ = costCenters.map((costCenter) => {
          const costCenterRef = doc(this.firestore, `cost-centers/${costCenter.id}`);
          const expensesCollection = collection(this.firestore, 'expenses');

          const q = query(
            expensesCollection,
            where('costCenter', '==', costCenterRef),
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate)),
          );

          return from(getAggregateFromServer(q, { totalAmount: sum('amount') })).pipe(
            map((snapshot) => ({
              costCenterId: costCenter.id,
              total: snapshot.data().totalAmount || 0,
            })),
          );
        });

        // 3. Ejecutar todas las agregaciones en paralelo
        return forkJoin(totalObservables$).pipe(
          map((results) => {
            // 4. Transformar el array de resultados en el objeto CostCentersTotalized
            const totals: CostCentersTotalized = {};
            for (const result of results) {
              if (result.total > 0) {
                totals[result.costCenterId] = result.total;
              }
            }
            return totals;
          }),
        );
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
