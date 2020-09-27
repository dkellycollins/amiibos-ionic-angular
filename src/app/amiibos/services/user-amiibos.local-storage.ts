import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { UserAmiiboModel } from '../models/user-amiibo.model';

@Injectable()
export class UserAmiibosLocalStorage {

  private static readonly localStorageKey = 'UserAmiibosService.userAmiibos';

  public collection$(): Observable<Array<UserAmiiboModel>> {
    return this.localStorage$.asObservable();
  }

  public update(amiiboSlug: string, isCollected: boolean): void {
    this.localStorage$.next([
      ...this.localStorage$.getValue().filter(userAmiibo => userAmiibo.amiiboSlug !== amiiboSlug),
      { amiiboSlug: amiiboSlug, isCollected: isCollected }
    ]);
  }

  private _localStorage$?: BehaviorSubject<Array<UserAmiiboModel>>;
  private get localStorage$(): BehaviorSubject<Array<UserAmiiboModel>> {
    if (!this._localStorage$) {
      this._localStorage$ = new BehaviorSubject<Array<UserAmiiboModel>>(this.load());
      this._localStorage$.pipe(skip(1)).subscribe(this.save.bind(this));
    }
    return this._localStorage$;
  }

  private save(collectedAmiibos: Array<UserAmiiboModel>) {
    try {
      localStorage.setItem(UserAmiibosLocalStorage.localStorageKey, JSON.stringify(collectedAmiibos));
    } catch (error) {
      console.error(error);
    }
  }

  private load(): Array<UserAmiiboModel> {
    try {
      const data = localStorage.getItem(UserAmiibosLocalStorage.localStorageKey);

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