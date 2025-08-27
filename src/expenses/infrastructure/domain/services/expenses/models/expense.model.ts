import { CostCenter } from '../../../../../../cost-center/infrastructure/domain/services/cost-center';

export interface Expense {
  id: string;
  amount: number;
  date: Date; // ISO 8601
  costCenter: CostCenter;
  description: string;
  season: string;
}
