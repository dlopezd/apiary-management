import { InjectionToken } from '@angular/core';
import { AuthenticationService } from '../domain/services/authentication';


export const AUTHENTICATION_SERVICE = new InjectionToken<AuthenticationService>('AuthenticationService');
