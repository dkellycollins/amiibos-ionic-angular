import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';
import { CollectionProgressModel } from 'src/app/amiibos/models/collection-progress.model';
import { AmiibosService } from 'src/app/amiibos/services/amiibos.service';
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

  public amiibos$: Observable<Array<AmiiboModel>>;
  public selectedSeries$: Observable<string>;
  public collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;
  public progress$: Observable<CollectionProgressModel>;
  public pageTitle$: Observable<string>;

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly selectSeriesModalService: SelectSeriesModalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.amiibos$ = this.amiibosService.amiibos$;
    this.selectedSeries$ = this.amiibosService.selectedSeries$;
    this.collectedAmiibos$ = this.amiibosService.collectedAmiibos$;
    this.progress$ = this.amiibosService.progress$;
    this.pageTitle$ = this.selectedSeries$.pipe(map(selectedSeries => selectedSeries || 'All Amiibos'));

    this.amiibosService.loadAmiibos();

    const routeSub = combineLatest([this.activatedRoute.data, this.activatedRoute.queryParams])
      .subscribe(([data, params]) => this.amiibosService.setFilters({ type: data.type, series: params.series }));

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
    this.amiibosService.toggleAmiibo(slug, collected);
  }
}
