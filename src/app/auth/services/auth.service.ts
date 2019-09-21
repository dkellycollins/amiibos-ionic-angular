import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, auth } from 'firebase';

export interface UserModel {
  uid: string;
  photoUrl?: string;
  displayName: string;
}

@Injectable()
export class AuthService {

  constructor(private readonly fireAuth: AngularFireAuth) { }

  public getUser(): Observable<UserModel | undefined> {
    return this.fireAuth.user.pipe(
      map(user => !!user ? this.mapToUserModel(user) : undefined)
    );
  }

  public async login(): Promise<void> {
    await this.fireAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
  }

  public async logout(): Promise<void> {
    await this.fireAuth.auth.signOut();
  }

  private mapToUserModel(user: User): UserModel {
    return {
      uid: user.uid,
      photoUrl: user.photoURL,
      displayName: user.displayName
    };
  }
}
