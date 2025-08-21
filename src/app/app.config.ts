import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideRouter } from '@angular/router';

import { FirebaseAuthenticationService } from '../authentication/infrastructure/domain/services/authentication/firebase-authentication.service';
import { AUTHENTICATION_SERVICE } from '../authentication/infrastructure/framework/auth.token';
import { SignInUseCase } from '../authentication/usecases/sign-in.use-case';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    SignInUseCase,
    {
      provide: AUTHENTICATION_SERVICE,
      useClass: FirebaseAuthenticationService,
    },
  ],
};
