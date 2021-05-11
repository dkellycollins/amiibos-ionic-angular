import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AmiiboModel } from "../models/amiibo.model";
import { CollectionProgressModel } from "../models/collection-progress.model";
import { AmiibosActions } from "../state/amiibos.actions";
import { AmiibosSelectors } from "../state/amiibos.selectors";

@Injectable()
export class AmiibosService {
  @Select(AmiibosSelectors.selectedAmiibos)
  public readonly amiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosSelectors.selectedSeries)
  public readonly selectedSeries$: Observable<string>;

  @Select(AmiibosSelectors.collectedAmiibos)
  public readonly collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;

  @Select(AmiibosSelectors.progress)
  public readonly progress$: Observable<CollectionProgressModel>;

  constructor(
    private readonly store: Store
  ) { }

  public loadAmiibos(): Observable<unknown> {
    return this.store.dispatch(new AmiibosActions.LoadAmiibos());
  }

  public setFilters(filters: { type?: string, series?: string }): Observable<unknown> {
    return this.store.dispatch(new AmiibosActions.SetFilters(filters))
  }

  public toggleAmiibo(slug: string, collected: boolean): Observable<unknown> {
    return this.store.dispatch(new AmiibosActions.ToggleAmiibo(slug, collected));
  }
}