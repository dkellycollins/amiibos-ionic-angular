import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { UserModel } from "../models/user.model";
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';

interface AuthStateModel {
  user?: UserModel
}

class SetUser {
  public static readonly type = '[Auth] Set user';

  constructor(public readonly payload: UserModel) { }
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null
  }
})
@Injectable()
export class AuthState implements NgxsOnInit {

  @Selector([AuthState])
  public static user(state: AuthStateModel): UserModel {
    return state.user;
  }

  constructor(
    private readonly authService: AuthService
  ) { }

  public ngxsOnInit(context: StateContext<AuthStateModel>): void {
    this.authService.getUser().subscribe(user => context.dispatch(new SetUser(user)));
  }

  @Action(AuthActions.Login)
  public async login(): Promise<void> {
    this.authService.login();
  }

  @Action(AuthActions.Logout)
  public async logout(): Promise<void> {
    this.authService.logout();
  }

  @Action(SetUser)
  public setUser(context: StateContext<AuthStateModel>, { payload }: SetUser): void {
    context.patchState({
      user: payload
    });
  }
}