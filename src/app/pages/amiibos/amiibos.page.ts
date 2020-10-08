import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';
import { CollectionProgressModel } from 'src/app/amiibos/models/collection-progress.model';
import { AmiibosActions } from 'src/app/amiibos/state/amiibos.actions';
import { AmiibosSelectors } from 'src/app/amiibos/state/amiibos.selectors';
import { AmiiboModel } from '../../amiibos/models/amiibo.model';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
})
export class AmiibosPage implements OnInit, OnDestroy {

  @Select(AmiibosSelectors.selectedAmiibos)
  public readonly amiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosSelectors.selectedSeries)
  public readonly selectedSeries$: Observable<string>;

  @Select(AmiibosSelectors.collectedAmiibos)
  public readonly collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;

  @Select(AmiibosSelectors.progress)
  public readonly progress$: Observable<CollectionProgressModel>;

  private subscriptions: Array<Subscription>;

  public constructor(
    private readonly store: Store,
    private readonly selectSeriesModalService: SelectSeriesModalService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    const routeDataSub = this.activatedRoute.data.subscribe(data => this.store.dispatch(new AmiibosActions.LoadAmiibos(data.type)));

    this.subscriptions = [routeDataSub];
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public async selectSeries(): Promise<void> {
    const data = await this.selectSeriesModalService.open();
    this.store.dispatch(new AmiibosActions.SelectSeries(data));
  }

  public toggleAmiibo({ slug, collected }: { slug: string, collected: boolean }): void {
    this.store.dispatch(new AmiibosActions.ToggleAmiibo(slug, collected));
  }
}
