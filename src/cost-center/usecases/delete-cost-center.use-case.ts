import { inject, Injectable } from '@angular/core';
import { COST_CENTER_SERVICE } from '../infrastructure/framework/cost-center.token';

@Injectable({
  providedIn: 'root',
})
export class DeleteCostCenterUseCase {
  private costCenterService = inject(COST_CENTER_SERVICE);

  execute(id: string): Promise<void> {
    return this.costCenterService.delete(id);
  }
}
