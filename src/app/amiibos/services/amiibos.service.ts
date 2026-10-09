import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AmiiboModel } from "../models/amiibo.model";
import { AmiiboSortModel } from "../models/amiibo-sort.model";
import { CollectableAmiiboModel } from "../models/collectable-amiibo.model";
import { CollectionProgressModel } from "../models/collection-progress.model";
import { AmiibosActions } from "../state/amiibos.actions";
import { AmiibosSelectors } from "../state/amiibos.selectors";

@Injectable()
export class AmiibosService {
  @Select(AmiibosSelectors.allAmiibos)
  public readonly allAmiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosSelectors.selectedAmiibos)
  public readonly amiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosSelectors.selectedSeries)
  public readonly selectedSeries$: Observable<string>;

  @Select(AmiibosSelectors.selectedSort)
  public readonly selectedSort$: Observable<AmiiboSortModel>;

  @Select(AmiibosSelectors.collectedAmiibos)
  public readonly collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;

  @Select(AmiibosSelectors.progress)
  public readonly progress$: Observable<CollectionProgressModel>;

  constructor(
    private readonly store: Store
  ) { }

  public collectableAmiiboBySlug$(slug: string): Observable<CollectableAmiiboModel | undefined> {
    return this.store.select(AmiibosSelectors.collectableAmiiboBySlug(slug));
  }

  public loadAmiibos(): Observable<unknown> {
    return this.store.dispatch(new AmiibosActions.LoadAmiibos());
  }

  public setFilters(filters: { type?: string, series?: string, sort?: AmiiboSortModel }): Observable<unknown> {
    return this.store.dispatch(new AmiibosActions.SetFilters(filters))
  }

  public toggleAmiibo(slug: string, collected: boolean): Observable<unknown> {
    return this.store.dispatch(new AmiibosActions.ToggleAmiibo(slug, collected));
  }
}