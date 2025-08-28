import { InjectionToken } from '@angular/core';
import { CostCenterService } from '../domain/services/cost-center';

export const COST_CENTER_SERVICE = new InjectionToken<CostCenterService>('CostCenterService');
