import { Observable } from 'rxjs';
import { CostCenter } from '../../../../../cost-center/infrastructure/domain/services/cost-center';
import { CostCentersTotalized } from './models/cost-center-totalized.model';

export interface ReportService {
  getTotalByCostCenter(startDate: Date, endDate: Date): Observable<CostCentersTotalized>;
  getTotalsByCostCenterAndSeason(): Observable<
    { season: string; costCenter: CostCenter; total: number }[]
  >;
}
