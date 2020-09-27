import { Selector } from '@ngxs/store';
import { keyBy } from 'lodash';
import { AmiiboModel } from '../models/amiibo.model';
import { CollectableAmiiboModel } from '../models/collectable-amiibo.model';
import { CollectionProgressModel } from '../models/collection-progress.model';
import { UserAmiiboModel } from '../models/user-amiibo.model';
import { AmiibosState, AmiibosStateModel } from './amiibos.state';

export class AmiibosSelectors {

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

  @Selector([AmiibosSelectors.allAmiibos])
  public static series(amiibos: Array<AmiiboModel>): Array<String> {
    return amiibos
      .map(amiibo => amiibo.series)
      .filter((series: string | null): series is string => !!series)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  @Selector([AmiibosSelectors.allAmiibos, AmiibosSelectors.selectedSeries])
  public static selectedAmiibos(
    amiibos: Array<AmiiboModel>,
    selectedSeries: string
  ): Array<AmiiboModel> {
    if (selectedSeries === 'All Amiibos' || !selectedSeries) {
      return amiibos;
    }
    return amiibos.filter((amiibo) => amiibo.series === selectedSeries);
  }

  @Selector([AmiibosSelectors.selectedAmiibos, AmiibosSelectors.userAmiibos])
  public static collectedAmiibos(amiibos: Array<AmiiboModel>, userAmiibos: Array<UserAmiiboModel>): Array<CollectableAmiiboModel> {
    const userAmiiboBySlug = keyBy(userAmiibos, (userAmiibo) => userAmiibo.amiiboSlug);
    return amiibos.map(amiibo => ({
      ...amiibo,
      isCollected: !!userAmiiboBySlug[amiibo.slug] && userAmiiboBySlug[amiibo.slug].isCollected
    }));
  }

  @Selector([AmiibosSelectors.selectedAmiibos, AmiibosSelectors.collectedAmiibos])
  public static progress(amiibos: Array<AmiiboModel>, collectedAmiibos: Array<CollectableAmiiboModel>): CollectionProgressModel {
    return { total: amiibos.length, collected: collectedAmiibos.filter(amiibo => amiibo.isCollected).length };
  }
}