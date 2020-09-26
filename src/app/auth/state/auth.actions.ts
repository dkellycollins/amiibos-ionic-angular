import { UserModel } from '../models/user.model';

export namespace AuthActions {
  export class Login {
    public static readonly type = '[Auth] Login';
  }

  export class Logout {
    public static readonly type = '[Auth] Logout';
  }

  export class SetUser {
    public static readonly type = '[Auth] Set user';

    constructor(public readonly payload: UserModel) { }
  }
}
