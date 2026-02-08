import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { AuthService } from './app/auth/services/auth.service';
import { AmiibosService } from './app/amiibos/services/amiibos.service';
import { SelectSeriesModalService } from './app/amiibos/components/select-series-modal/select-series-modal.service';
import { AmiibosFirestore } from './app/amiibos/services/amiibos.firestore';
import { UserAmiibosFirestore } from './app/amiibos/services/user-amiibos.firestore';
import { UserAmiibosLocalStorage } from './app/amiibos/services/user-amiibos.local-storage';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StatusBar,
    SplashScreen,
    AuthService,
    AmiibosService,
    SelectSeriesModalService,
    AmiibosFirestore,
    UserAmiibosFirestore,
    UserAmiibosLocalStorage,
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production
    })
  ]
}).catch(err => console.error(err));
