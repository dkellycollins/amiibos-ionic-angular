import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';
import { UserModel } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // Convert the auth service observable to a signal
  private readonly userSignal = toSignal(this.authService.getUser(), {
    initialValue: undefined
  });

  // Public readonly signals
  public readonly user = this.userSignal;
  public readonly isAuthenticated = computed(() => !!this.user());

  constructor(private readonly authService: AuthService) {}

  async login(): Promise<void> {
    await this.authService.login();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
