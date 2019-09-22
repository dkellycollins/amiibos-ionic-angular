import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

export interface UserAmiibo {
  userUid?: string;
  amiiboSlug: string;
  isCollected: boolean;
}

@Injectable()
export class UserAmiibosService {

  private static readonly localStorageKey = 'UserAmiibosService.userAmiibos';

  private readonly collectedAmiibos$: BehaviorSubject<Array<UserAmiibo>>;

  public constructor() {
    this.collectedAmiibos$ = new BehaviorSubject<Array<UserAmiibo>>(this.load());
    this.collectedAmiibos$.pipe(skip(1)).subscribe(this.save.bind(this));
  }

  public getCollectedAmiibos(): Observable<Array<string>> {
    return this.collectedAmiibos$.pipe(
      map(userAmiibos => userAmiibos.filter(userAmiibo => userAmiibo.isCollected).map(userAmiibo => userAmiibo.amiiboSlug))
    );
  }

  public toggleAmiibo(slug: string, collected: boolean) {
    this.collectedAmiibos$.next([
      ...this.collectedAmiibos$.getValue().filter(userAmiibo => userAmiibo.amiiboSlug !== slug),
      { amiiboSlug: slug, isCollected: collected }
    ]);
  }

  private save(collectedAmiibos: Array<UserAmiibo>) {
    try {
      localStorage.setItem(UserAmiibosService.localStorageKey, JSON.stringify(collectedAmiibos));
    } catch (error) {
      console.error(error);
    }
  }

  private load(): Array<UserAmiibo> {
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
