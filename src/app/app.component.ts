import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserModel } from './auth/models/user.model';
import { AuthActions } from './auth/state/auth.actions';
import { AuthState } from './auth/state/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @Select(AuthState.user)
  public user$: Observable<UserModel | undefined>;

  public get version(): string {
    return environment.version;
  }

  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly alertController: AlertController,
    private readonly store: Store
  ) {
    this.initializeApp();
  }

  public login() {
    this.store.dispatch(new AuthActions.Login());
  }

  public async logout() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Yes', handler: () => { 
          alert.dismiss(); 
          this.store.dispatch(new AuthActions.Logout());
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
