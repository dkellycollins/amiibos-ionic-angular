import { Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserModel } from './auth/models/user.model';
import { AuthStore } from './auth/services/auth.store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public user$: Observable<UserModel | undefined>;

  public get version(): string {
    return environment.version;
  }

  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly alertController: AlertController,
    private readonly authStore: AuthStore
  ) {
    this.user$ = toObservable(this.authStore.user);
    this.initializeApp();
  }

  public async login() {
    await this.authStore.login();
  }

  public async logout() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Yes', handler: () => {
          alert.dismiss();
          this.authStore.logout();
        }}
      ]
    });

    await alert.present();
  }

  private async initializeApp(): Promise<void> {
    await this.platform.ready();

    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
