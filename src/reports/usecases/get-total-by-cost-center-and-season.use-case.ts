import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { REPORT_SERVICE } from '../infrastructure/framework/report.token';
import { CostCenterAndSeasonTotal } from '../presentation/features/totals-by-cost-center-and-season/models/cost-center-total.view-model';

@Injectable({
  providedIn: 'root',
})
export class GetTotalByCostCenterUAndSeasonseCase {
  private reportService = inject(REPORT_SERVICE);

  execute(): Observable<CostCenterAndSeasonTotal[]> {
    return this.reportService.getTotalsByCostCenterAndSeason();
  }
}
