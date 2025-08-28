import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { CostCenter } from '../../cost-center/infrastructure/domain/services/cost-center';
import { COST_CENTER_SERVICE } from '../../cost-center/infrastructure/framework/cost-center.token';
import { REPORT_SERVICE } from '../infrastructure/framework/report.token';
import { CostCenterTotal } from '../presentation/features/totals-by-cost-center/models/cost-center-total.view-model';

@Injectable({
  providedIn: 'root',
})
export class GetTotalByCostCenterUseCase {
  private costCenterService = inject(COST_CENTER_SERVICE);
  private reportService = inject(REPORT_SERVICE);

  execute(startDate: Date, endDate: Date): Observable<CostCenterTotal[]> {
    const costCenters$ = this.costCenterService.list();
    const report$ = this.reportService.getTotalByCostCenter(startDate, endDate);

    return costCenters$.pipe(
      switchMap((costCenters: CostCenter[]) => {
        return report$.pipe(
          tap((totals) => console.log('Totals:', totals)),
          map((totals) => {
            return costCenters.map((costCenter: CostCenter) => {
              return {
                costCenter,
                total: totals[costCenter.id] || 0,
              };
            });
          }),
        );
      }),
    );
  }
}
