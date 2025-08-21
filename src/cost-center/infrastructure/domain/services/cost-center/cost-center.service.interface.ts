import { CostCenter } from './models/cost-center.model';

export interface CostCenterService {
  list(): Promise<CostCenter[]>;
  getById(id: string): Promise<CostCenter | null>;
  create(costCenter: Omit<CostCenter, 'id'>): Promise<CostCenter>;
  update(id: string, costCenter: Omit<CostCenter, 'id'>): Promise<CostCenter>;
  delete(id: string): Promise<void>;
}
