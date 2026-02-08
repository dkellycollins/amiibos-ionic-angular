import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthService {

  constructor(
    private readonly auth: Auth
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
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(this.auth, provider);
  }

  /**
   * Clears the currently authenticated user.
   */
  public async logout(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  private mapToUserModel(firebaseUser: User): UserModel {
    return {
      uid: firebaseUser.uid,
      photoUrl: firebaseUser.photoURL,
      displayName: firebaseUser.displayName
    };
  }
}
