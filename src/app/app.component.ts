import { Component } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public get user$(): Observable<firebase.User> {
    return this.fireAuth.user;
  }

  public get version(): string {
    return environment.version;
  }

  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly fireAuth: AngularFireAuth
  ) {
    this.initializeApp();
  }

  public login() {
    this.fireAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  public logout() {
    this.fireAuth.auth.signOut();
  }

  private async initializeApp(): Promise<void> {
    await this.platform.ready();

    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
