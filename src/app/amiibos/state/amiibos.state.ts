import { Injectable } from '@angular/core';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamConnected,
  StreamEmitted
} from '@ngxs-labs/firestore-plugin';
import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
  selectedType: string,
  selectedSeries: string;
}

@State<AmiibosStateModel>({
  name: 'amiibos',
  defaults: {
    allAmiibos: [],
    userAmiibos: [],
    selectedType: null,
    selectedSeries: 'All Amiibos',
  },
})
@Injectable()
export class AmiibosState implements NgxsOnInit {

  constructor(
    private readonly ngxsFirestoreConnect: NgxsFirestoreConnect,
    private readonly amiibosFirestore: AmiibosFirestore,
    private readonly userAmiibosFirestore: UserAmiibosFirestore,
    private readonly userAmiibosLocalStorage: UserAmiibosLocalStorage,
    private readonly store: Store
  ) {}

  public ngxsOnInit(): void {
    this.ngxsFirestoreConnect.connect(AmiibosActions.LoadAmiibos, {
      to: () => this.amiibosFirestore.collection$(),
    });

    this.ngxsFirestoreConnect.connect(AmiibosActions.LoadUserAmiibos, {
      to: (action) => !!action.userUid 
        ? this.userAmiibosFirestore.collectionByUser$(action.userUid) 
        : this.userAmiibosLocalStorage.collection$()
    });
  }

  @Action(AmiibosActions.LoadAmiibos)
  public load(context: StateContext<AmiibosStateModel>, action: AmiibosActions.LoadAmiibos): void {
    context.patchState({
      selectedType: action.type,
      selectedSeries: 'All Amiibos'
    });
  }

  @Action(StreamEmitted(AmiibosActions.LoadAmiibos))
  public loadEmitted(
    context: StateContext<AmiibosStateModel>,
    action: Emitted<AmiibosActions.LoadAmiibos, Array<AmiiboModel>>
  ): void {
    context.patchState({
      allAmiibos: action.payload,
    });
  }

  @Action(StreamEmitted(AmiibosActions.LoadUserAmiibos))
  public loadUserAmiibosEmiited(context: StateContext<AmiibosStateModel>, action: Emitted<AmiibosActions.LoadUserAmiibos, Array<UserAmiiboModel>>): void {
    context.patchState({
      userAmiibos: action.payload
    })
  }

  @Action(AmiibosActions.SelectSeries)
  public selectSeries(
    context: StateContext<AmiibosStateModel>,
    { series }: AmiibosActions.SelectSeries
  ): void {
    context.patchState({
      selectedSeries: series,
    });
  }

  @Action(AmiibosActions.ToggleAmiibo)
  public async toggleAmiibo(context: StateContext<AmiibosStateModel>, action: AmiibosActions.ToggleAmiibo): Promise<void> {
    const user = this.store.selectSnapshot(AuthState.user);

    if (!!user) {
      await this.userAmiibosFirestore.update$(`${action.amiiboSlug}:${user.uid}`, {
        userUid: user.uid,
        amiiboSlug: action.amiiboSlug,
        isCollected: action.isCollected
      }).toPromise()
    }
    else {
      this.userAmiibosLocalStorage.update(action.amiiboSlug, action.isCollected)
    }
  }

  @Action(AuthActions.SetUser)
  public setUser(context: StateContext<AmiibosStateModel>, action: AuthActions.SetUser): Observable<void> {
    return context.dispatch(new AmiibosActions.LoadUserAmiibos(action.payload?.uid));
  }
}
