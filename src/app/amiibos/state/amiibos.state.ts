import { Injectable } from '@angular/core';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from "@ngxs-labs/firestore-plugin";
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from "@ngxs/store";
import { AuthActions } from 'src/app/auth/state/auth.actions';
import { AuthState } from 'src/app/auth/state/auth.state';
import { AmiibosModule } from '../amiibos.module';
import { AmiiboModel } from "../models/amiibo.model";
import { CollectableAmiiboModel } from '../models/collectable-amiibo.model';
import { CollectionProgressModel } from '../models/collection-progress.model';
import { UserAmiiboModel } from '../models/user-amiibo.model';
import { AmiibosFirestore } from "../services/amiibos.firestore";
import { UserAmiibosFirestore } from '../services/user-amiibos.firestore';
import { AmiibosActions } from "./amiibos.actions";

export interface AmiibosStateModel {
  allAmiibos: Array<AmiiboModel>;
  userAmiibos: Array<UserAmiiboModel>;
  selectedSeries: string;
}

@State<AmiibosStateModel>({
  name: "amiibos",
  defaults: {
    allAmiibos: [],
    userAmiibos: [],
    selectedSeries: 'All Amiibos',
  },
})
@Injectable()
export class AmiibosState implements NgxsOnInit {
  @Selector([AmiibosState])
  public static allAmiibos(state: AmiibosStateModel): Array<AmiiboModel> {
    return state.allAmiibos;
  }

  @Selector([AmiibosState])
  public static userAmiibos(state: AmiibosStateModel): Array<UserAmiiboModel> {
    return state.userAmiibos;
  }

  @Selector([AmiibosState])
  public static selectedSeries(state: AmiibosStateModel): string {
    return state.selectedSeries;
  }

  @Selector([AmiibosState.allAmiibos])
  public static series(amiibos: Array<AmiiboModel>): Array<String> {
    return amiibos
      .map(amiibo => amiibo.series)
      .filter((series: string | null): series is string => !!series)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  @Selector([AmiibosState.allAmiibos, AmiibosState.selectedSeries])
  public static selectedAmiibos(
    amiibos: Array<AmiiboModel>,
    selectedSeries: string
  ): Array<AmiiboModel> {
    if (selectedSeries === 'All Amiibos' || !selectedSeries) {
      return amiibos;
    }
    return amiibos.filter((amiibo) => amiibo.series === selectedSeries);
  }

  @Selector([AmiibosState.selectedAmiibos, AmiibosState.userAmiibos])
  public static collectedAmiibos(amiibos: Array<AmiiboModel>, userAmiibos: Array<UserAmiiboModel>): Array<CollectableAmiiboModel> {
    return amiibos.map(amiibo => ({
      ...amiibo,
      isCollected: userAmiibos.some(userAmiibo => userAmiibo.amiiboSlug === amiibo.slug)
    }));
  }

  @Selector([AmiibosState.selectedAmiibos, AmiibosState.collectedAmiibos])
  public static progress(amiibos: Array<AmiiboModel>, collectedAmiibos: Array<CollectableAmiiboModel>): CollectionProgressModel {
    return { total: amiibos.length, collected: collectedAmiibos.filter(amiibo => amiibo.isCollected).length };
  }

  constructor(
    private readonly ngxsFirestoreConnect: NgxsFirestoreConnect,
    private readonly amiibosFirestore: AmiibosFirestore,
    private readonly userAmiibosFirestore: UserAmiibosFirestore,
    private readonly store: Store
  ) {}

  public ngxsOnInit(): void {
    this.ngxsFirestoreConnect.connect(AmiibosActions.LoadAmiibos, {
      to: () => this.amiibosFirestore.collection$(),
    });

    this.ngxsFirestoreConnect.connect(AuthActions.SetUser, {
      to: (action) => this.userAmiibosFirestore.collectionByUser$(action.payload.uid)
    });
  }

  @Action(StreamEmitted(AmiibosActions.LoadAmiibos))
  public loadEmitted(
    context: StateContext<AmiibosStateModel>,
    { payload }: Emitted<AmiibosActions.LoadAmiibos, Array<AmiiboModel>>
  ): void {
    context.patchState({
      allAmiibos: payload,
    });
  }

  @Action(StreamEmitted(AuthActions.SetUser))
  public setUserEmiited(context: StateContext<AmiibosStateModel>, { payload }: Emitted<AuthActions.SetUser, Array<UserAmiiboModel>>): void {
    context.patchState({
      userAmiibos: payload
    });
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
    await this.userAmiibosFirestore.update$(`${action.amiiboSlug}:${user.uid}`, {
      userUid: user.uid,
      amiiboSlug: action.amiiboSlug,
      isCollected: action.isCollected
    }).toPromise();
  }
}
