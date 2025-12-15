import { FirestoreCostCenterService } from './infrastructure/domain/services/cost-center/firestore-cost-center.service';
import { COST_CENTER_SERVICE } from './infrastructure/framework/cost-center.token';

export const costCenterProviders = [
  {
    provide: COST_CENTER_SERVICE,
    useClass: FirestoreCostCenterService,
  },
];
