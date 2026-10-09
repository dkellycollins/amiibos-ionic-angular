import { createSelector, Selector } from '@ngxs/store';
import keyBy from 'lodash/keyBy';
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
  public static selectedType(state: AmiibosStateModel): string {
    return state.filters.type;
  }

  @Selector([AmiibosState])
  public static selectedSeries(state: AmiibosStateModel): string {
    return state.filters.series;
  }

  @Selector([AmiibosSelectors.allAmiibos, AmiibosSelectors.selectedType])
  public static series(amiibos: Array<AmiiboModel>, selectedType: string): Array<String> {
    return amiibos
      .filter(amiibo => amiibo.type === selectedType)
      .map(amiibo => amiibo.series)
      .filter((series: string | null): series is string => !!series)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  @Selector([AmiibosSelectors.allAmiibos, AmiibosSelectors.selectedType, AmiibosSelectors.selectedSeries])
  public static selectedAmiibos(
    amiibos: Array<AmiiboModel>,
    selectedType: string,
    selectedSeries: string
  ): Array<AmiiboModel> {
    if (!selectedType) {
      return [];
    }

    return amiibos
      .filter(amiibo => amiibo.type === selectedType)
      .filter(amiibo => !selectedSeries || amiibo.series === selectedSeries);
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

  /**
   * Selects a single Amiibo by slug, along with whether the user has collected it.
   * Searches all Amiibos so the result does not depend on the current filters.
   */
  public static collectableAmiiboBySlug(slug: string) {
    return createSelector(
      [AmiibosSelectors.allAmiibos, AmiibosSelectors.userAmiibos],
      (amiibos: Array<AmiiboModel>, userAmiibos: Array<UserAmiiboModel>): CollectableAmiiboModel | undefined => {
        const amiibo = amiibos.find(candidate => {
          return candidate.slug === slug;
        });

        if (!amiibo) {
          return undefined;
        }

        const userAmiibo = userAmiibos.find(candidate => {
          return candidate.amiiboSlug === slug;
        });

        return {
          ...amiibo,
          isCollected: !!userAmiibo && userAmiibo.isCollected
        };
      }
    );
  }
}
