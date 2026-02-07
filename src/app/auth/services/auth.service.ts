import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut, user, User } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
// import { cfaSignInGoogle, cfaSignOut } from 'capacitor-firebase-auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthService {

  constructor(
    private readonly auth: Auth,
    private readonly platform: Platform
  ) { }

  /**
   * Returns an observable with the currently authenticate User, or undefined if the user has not logged in.
   *
   * @returns An observable that will emit the currently authenticated User.
   */
  public getUser(): Observable<UserModel | undefined> {
    return user(this.auth).pipe(
      map(firebaseUser => !!firebaseUser ? this.mapToUserModel(firebaseUser) : undefined)
    );
  }

  /**
   * Redirects the application to a sign in page.
   */
  public async login(): Promise<void> {
    // Capacitor-specific auth will be removed in Phase 6
    // if (this.platform.is('android')) {
    //   await cfaSignInGoogle().toPromise();
    // }
    // else {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(this.auth, provider);
    // }

  }

  /**
   * Clears the currently authenticated user.
   */
  public async logout(): Promise<void> {
    // Capacitor-specific auth will be removed in Phase 6
    // if (this.platform.is('android')) {
    //   await cfaSignOut().toPromise();
    // }
    // else {
      await firebaseSignOut(this.auth);
    // }
  }

  private mapToUserModel(firebaseUser: User): UserModel {
    return {
      uid: firebaseUser.uid,
      photoUrl: firebaseUser.photoURL,
      displayName: firebaseUser.displayName
    };
  }
}
