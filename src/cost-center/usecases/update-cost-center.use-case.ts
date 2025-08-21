import { inject, Injectable } from '@angular/core';
import { CostCenter } from '../infrastructure/domain/services/cost-center';
import { COST_CENTER_SERVICE } from '../infrastructure/framework/cost-center.token';

@Injectable({
  providedIn: 'root',
})
export class UpdateCostCenterUseCase {
  private costCenterService = inject(COST_CENTER_SERVICE);

  execute(id: string, name: string): Promise<CostCenter> {
    return this.costCenterService.update(id, { name });
  }
}
