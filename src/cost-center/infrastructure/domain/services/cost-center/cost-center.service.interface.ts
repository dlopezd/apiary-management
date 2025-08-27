import { Observable } from 'rxjs';
import { CostCenter } from './models/cost-center.model';

export interface CostCenterService {
  list(): Observable<CostCenter[]>;
  getById(id: string): Observable<CostCenter | null>;
  create(costCenter: Omit<CostCenter, 'id'>): Observable<CostCenter>;
  update(id: string, costCenter: Omit<CostCenter, 'id'>): Observable<CostCenter>;
  delete(id: string): Observable<void>;
}
