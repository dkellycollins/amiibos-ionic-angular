import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';
import { CollectionProgressModel } from 'src/app/amiibos/models/collection-progress.model';
import { AmiibosActions } from 'src/app/amiibos/state/amiibos.actions';
import { AmiibosSelectors } from 'src/app/amiibos/state/amiibos.selectors';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { AmiiboModel } from '../../amiibos/models/amiibo.model';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
  providers: [
    SubscriptionService
  ]
})
export class AmiibosPage implements OnInit {

  @Select(AmiibosSelectors.selectedAmiibos)
  public readonly amiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosSelectors.selectedSeries)
  public readonly selectedSeries$: Observable<string>;

  @Select(AmiibosSelectors.collectedAmiibos)
  public readonly collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;

  @Select(AmiibosSelectors.progress)
  public readonly progress$: Observable<CollectionProgressModel>;

  public pageTitle$: Observable<string>;

  public constructor(
    private readonly store: Store,
    private readonly selectSeriesModalService: SelectSeriesModalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.pageTitle$ = this.selectedSeries$.pipe(map(selectedSeries => selectedSeries || 'All Amiibos'));

    this.store.dispatch(new AmiibosActions.LoadAmiibos());

    const routeSub = combineLatest([this.activatedRoute.data, this.activatedRoute.queryParams])
      .subscribe(([data, params]) => {
        this.store.dispatch(new AmiibosActions.SetFilters({ type: data.type, series: params.series }))
      });

    this.subscriptionService.add(routeSub);
  }

  public async selectSeries(): Promise<void> {
    const data = await this.selectSeriesModalService.open();
    if (data === undefined) {
      return;
    }

    await this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { series: data }});
  }

  public toggleAmiibo({ slug, collected }: { slug: string, collected: boolean }): void {
    this.store.dispatch(new AmiibosActions.ToggleAmiibo(slug, collected));
  }
}
