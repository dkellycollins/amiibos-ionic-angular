import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserModel } from 'src/app/auth/services/UserModel';
import { UserAmiiboModel } from './UserAmiiboModel';

@Injectable()
export class UserAmiibosService {

  private static readonly localStorageKey = 'UserAmiibosService.userAmiibos';

  public constructor(
    private readonly database: AngularFirestore,
    private readonly authService: AuthService
  ) {
    
  }

  /**
   * Returns an Observable that emits the list of collected Amiibos.
   */
  public getCollectedAmiibos(): Observable<Array<string>> {
    return this.user$
      .pipe(
        switchMap(user => !user ? this.localStorage$ : this.getFromFirestore(user)),
        map(userAmiibos => userAmiibos.filter(userAmiibo => userAmiibo.isCollected).map(userAmiibo => userAmiibo.amiiboSlug))
      );
  }

  /**
   * Sets the collected status for the specified Amiibo.
   * 
   * @param slug - The unique id of the Amiibo.
   * @param collected - True of the Amiibo has been collected, False otherwise.
   * 
   * @returns - A promise that is resolved once the action is complete.
   */
  public async toggleAmiibo(slug: string, collected: boolean): Promise<void> {
    const user = this.user$.getValue();
    if (!!user) {
      await this.userAmiiboCollection
        .doc<UserAmiiboModel>(`${slug}:${user.uid}`)
        .set({
          userUid: user.uid,
          amiiboSlug: slug,
          isCollected: collected
        });
    }
    else {
      this.localStorage$.next([
        ...this.localStorage$.getValue().filter(userAmiibo => userAmiibo.amiiboSlug !== slug),
        { amiiboSlug: slug, isCollected: collected }
      ]);
    }
  }

  private _localStorage$?: BehaviorSubject<Array<UserAmiiboModel>>;
  private get localStorage$(): BehaviorSubject<Array<UserAmiiboModel>> {
    if (!this._localStorage$) {
      this._localStorage$ = new BehaviorSubject<Array<UserAmiiboModel>>(this.load());
      this._localStorage$.pipe(skip(1)).subscribe(this.save.bind(this));
    }
    return this._localStorage$;
  }

  private _user$?: BehaviorSubject<UserModel | undefined>;
  private get user$(): BehaviorSubject<UserModel | undefined> {
    if (!this._user$) {
      this._user$ = new BehaviorSubject<UserModel | undefined>(undefined);
      this.authService.getUser().subscribe(this._user$);
    }
    return this._user$;
  }

  private get userAmiiboCollection(): AngularFirestoreCollection<UserAmiiboModel> {
    return this.database.collection('user-amiibos');
  }

  private getFromFirestore(user: UserModel): Observable<Array<UserAmiiboModel>> {
    const query: QueryFn = ref => ref.where('userUid', '==', user.uid);
    return this.database.collection<UserAmiiboModel>('user-amiibos', query).valueChanges()
  }

  private save(collectedAmiibos: Array<UserAmiiboModel>) {
    try {
      localStorage.setItem(UserAmiibosService.localStorageKey, JSON.stringify(collectedAmiibos));
    } catch (error) {
      console.error(error);
    }
  }

  private load(): Array<UserAmiiboModel> {
    try {
      const data = localStorage.getItem(UserAmiibosService.localStorageKey);

      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
