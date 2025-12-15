import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CostCenter } from '../infrastructure/domain/services/cost-center';
import { COST_CENTER_SERVICE } from '../infrastructure/framework/cost-center.token';

@Injectable({
  providedIn: 'root',
})
export class ListCostCentersUseCase {
  private costCenterService = inject(COST_CENTER_SERVICE);

  execute(): Observable<CostCenter[]> {
    return this.costCenterService.list();
  }
}
