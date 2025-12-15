import { CostCenter } from '../../../../../cost-center/infrastructure/domain/services/cost-center';

export interface CostCenterTotal {
  costCenter: CostCenter;
  total: number;
}
