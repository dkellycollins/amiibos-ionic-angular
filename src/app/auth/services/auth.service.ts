import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, auth } from 'firebase';
import { UserModel } from './UserModel';
import { cfaSignIn, cfaSignOut, cfaSignInGoogle } from 'capacitor-firebase-auth';
import { Platform } from '@ionic/angular';

@Injectable()
export class AuthService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly platform: Platform
  ) { }

  /**
   * Returns an observable with the currently authenticate User, or undefined if the user has not logged in.
   * 
   * @returns An observable that will emit the currently authenticated User.
   */
  public getUser(): Observable<UserModel | undefined> {
    return this.fireAuth.user.pipe(
      map(user => !!user ? this.mapToUserModel(user) : undefined)
    );
  }

  /**
   * Redirects the application to a sign in page.
   */
  public async login(): Promise<void> {
    if (this.platform.is('android')) {
      await cfaSignInGoogle().toPromise();
    }
    else {
      await this.fireAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    }
    
  }

  /**
   * Clears the currently authenticated user.
   */
  public async logout(): Promise<void> {
    if (this.platform.is('android')) {
      await cfaSignOut().toPromise();
    }
    else {
      await this.fireAuth.auth.signOut();
    }
  }

  private mapToUserModel(user: User): UserModel {
    return {
      uid: user.uid,
      photoUrl: user.photoURL,
      displayName: user.displayName
    };
  }
}
