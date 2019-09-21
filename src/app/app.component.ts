import { Component, OnInit } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, UserModel } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public user$: Observable<UserModel | undefined>;

  public get version(): string {
    return environment.version;
  }

  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly authService: AuthService,
    private readonly alertController: AlertController
  ) {
    this.initializeApp();
  }

  public ngOnInit() {
    this.user$ = this.authService.getUser();
  }

  public login() {
    this.authService.login();
  }

  public async logout() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Yes', handler: () => { 
          alert.dismiss(); 
          this.authService.logout(); 
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
