import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { COST_CENTER_SERVICE } from '../infrastructure/framework/cost-center.token';

@Injectable({
  providedIn: 'root',
})
export class DeleteCostCenterUseCase {
  private costCenterService = inject(COST_CENTER_SERVICE);

  execute(id: string): Observable<void> {
    return this.costCenterService.delete(id);
  }
}
