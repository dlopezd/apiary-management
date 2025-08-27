import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CostCenter } from '../infrastructure/domain/services/cost-center';
import { COST_CENTER_SERVICE } from '../infrastructure/framework/cost-center.token';

@Injectable({
  providedIn: 'root',
})
export class CreateCostCenterUseCase {
  private costCenterService = inject(COST_CENTER_SERVICE);

  execute(name: string): Observable<CostCenter> {
    return this.costCenterService.create({ name });
  }
}
