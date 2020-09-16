import { Injectable } from '@angular/core';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from "@ngxs-labs/firestore-plugin";
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";
import { AmiiboModel } from "../services/AmiiboModel";
import { AmiibosFirestore } from "../services/amiibos.firestore";
import { AmiibosActions } from "./amiibos.actions";

export interface AmiibosStateModel {
  allAmiibos: Array<AmiiboModel>;
  selectedSeries: string;
}

@State<AmiibosStateModel>({
  name: "amiibos",
  defaults: {
    allAmiibos: [],
    selectedSeries: 'All Amiibos',
  },
})
@Injectable()
export class AmiibosState implements NgxsOnInit {
  @Selector([AmiibosState])
  public static allAmiibos(state: AmiibosStateModel): Array<AmiiboModel> {
    return state.allAmiibos;
  }

  @Selector([AmiibosState.allAmiibos])
  public static series(amiibos: Array<AmiiboModel>): Array<String> {
    return amiibos
      .map(amiibo => amiibo.series)
      .filter((series: string | null): series is string => !!series)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  @Selector([AmiibosState])
  public static selectedSeries(state: AmiibosStateModel): string {
    return state.selectedSeries;
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

  constructor(
    private readonly ngxsFirestoreConnect: NgxsFirestoreConnect,
    private readonly amiibosFirestore: AmiibosFirestore
  ) {}

  public ngxsOnInit(): void {
    this.ngxsFirestoreConnect.connect(AmiibosActions.LoadAmiibos, {
      to: () => this.amiibosFirestore.collection$(),
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

  @Action(AmiibosActions.SelectSeries)
  public selectSeries(
    context: StateContext<AmiibosStateModel>,
    { series }: AmiibosActions.SelectSeries
  ): void {
    context.patchState({
      selectedSeries: series,
    });
  }
}
