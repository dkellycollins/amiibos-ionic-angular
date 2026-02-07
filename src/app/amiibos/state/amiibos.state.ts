import { Injectable, OnDestroy } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AuthActions } from 'src/app/auth/state/auth.actions';
import { AuthState } from 'src/app/auth/state/auth.state';
import { AmiiboModel } from '../models/amiibo.model';
import { UserAmiiboModel } from '../models/user-amiibo.model';
import { AmiibosFirestore } from '../services/amiibos.firestore';
import { UserAmiibosFirestore } from '../services/user-amiibos.firestore';
import { UserAmiibosLocalStorage } from '../services/user-amiibos.local-storage';
import { AmiibosActions } from './amiibos.actions';

export interface AmiibosStateModel {
  allAmiibos: Array<AmiiboModel>;
  userAmiibos: Array<UserAmiiboModel>;
  filters: {
    type: string,
    series: string
  };
}

@State<AmiibosStateModel>({
  name: 'amiibos',
  defaults: {
    allAmiibos: [],
    userAmiibos: [],
    filters: {
      type: null,
      series: null
    }
  },
})
@Injectable()
export class AmiibosState implements NgxsOnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(
    private readonly amiibosFirestore: AmiibosFirestore,
    private readonly userAmiibosFirestore: UserAmiibosFirestore,
    private readonly userAmiibosLocalStorage: UserAmiibosLocalStorage,
    private readonly store: Store
  ) {}

  public ngxsOnInit(context: StateContext<AmiibosStateModel>): void {
    // Subscribe to all amiibos collection
    this.subscriptions.add(
      this.amiibosFirestore.collection$().subscribe(amiibos => {
        context.patchState({ allAmiibos: amiibos });
      })
    );

    // Subscribe to user amiibos - will be loaded when user logs in
    const user = this.store.selectSnapshot(AuthState.user);
    this.loadUserAmiibos(context, user?.uid);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadUserAmiibos(context: StateContext<AmiibosStateModel>, userUid?: string): void {
    const source$ = userUid
      ? this.userAmiibosFirestore.collectionByUser$(userUid)
      : this.userAmiibosLocalStorage.collection$();

    this.subscriptions.add(
      source$.subscribe(userAmiibos => {
        context.patchState({ userAmiibos });
      })
    );
  }

  @Action(AmiibosActions.SetFilters)
  public selectSeries(
    context: StateContext<AmiibosStateModel>,
    action: AmiibosActions.SetFilters
  ): void {
    const state = context.getState();
    context.patchState({
      filters: {
        ...state.filters,
        ...action.filters
      }
    });
  }

  @Action(AmiibosActions.ToggleAmiibo)
  public async toggleAmiibo(context: StateContext<AmiibosStateModel>, action: AmiibosActions.ToggleAmiibo): Promise<void> {
    const user = this.store.selectSnapshot(AuthState.user);

    if (!!user) {
      await this.userAmiibosFirestore.update(`${action.amiiboSlug}:${user.uid}`, {
        userUid: user.uid,
        amiiboSlug: action.amiiboSlug,
        isCollected: action.isCollected
      });
    }
    else {
      this.userAmiibosLocalStorage.update(action.amiiboSlug, action.isCollected)
    }
  }

  @Action(AuthActions.SetUser)
  public setUser(context: StateContext<AmiibosStateModel>, action: AuthActions.SetUser): void {
    // Reload user amiibos when auth state changes
    this.loadUserAmiibos(context, action.payload?.uid);
  }
}
