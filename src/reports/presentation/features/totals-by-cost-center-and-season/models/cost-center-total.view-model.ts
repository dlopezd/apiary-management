import { CostCenter } from '../../../../../cost-center/infrastructure/domain/services/cost-center';

export interface CostCenterAndSeasonTotal {
  costCenter: CostCenter;
  season: string;
  total: number;
}
