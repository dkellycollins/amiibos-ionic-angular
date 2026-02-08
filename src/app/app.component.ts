import { Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserModel } from './auth/models/user.model';
import { AuthStore } from './auth/services/auth.store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, RouterOutlet, RouterLink, AsyncPipe, NgIf]
})
export class AppComponent {

  public user$: Observable<UserModel | undefined>;

  public get version(): string {
    return environment.version;
  }

  constructor(
    private readonly alertController: AlertController,
    private readonly authStore: AuthStore
  ) {
    this.user$ = toObservable(this.authStore.user);
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
}
