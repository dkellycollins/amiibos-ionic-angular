import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';
import { SelectSortActionSheetService } from 'src/app/amiibos/components/select-sort-action-sheet/select-sort-action-sheet.service';
import {
  AmiiboSortModel,
  DEFAULT_AMIIBO_SORT,
  isAmiiboSortDirection,
  isAmiiboSortField
} from 'src/app/amiibos/models/amiibo-sort.model';
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
  public selectedSort$: Observable<AmiiboSortModel>;
  public collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;
  public progress$: Observable<CollectionProgressModel>;
  public pageTitle$: Observable<string>;

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly selectSeriesModalService: SelectSeriesModalService,
    private readonly selectSortActionSheetService: SelectSortActionSheetService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.amiibos$ = this.amiibosService.amiibos$;
    this.selectedSeries$ = this.amiibosService.selectedSeries$;
    this.selectedSort$ = this.amiibosService.selectedSort$;
    this.collectedAmiibos$ = this.amiibosService.collectedAmiibos$;
    this.progress$ = this.amiibosService.progress$;
    this.pageTitle$ = this.selectedSeries$.pipe(map(selectedSeries => selectedSeries || 'All Amiibos'));

    this.amiibosService.loadAmiibos();

    const routeSub = combineLatest([this.activatedRoute.data, this.activatedRoute.queryParams])
      .subscribe(([data, params]) => {
        this.amiibosService.setFilters({
          type: data.type,
          series: params.series,
          sort: this.parseSortParams(params)
        });
      });

    this.subscriptionService.add(routeSub);
  }

  public async selectSeries(): Promise<void> {
    const data = await this.selectSeriesModalService.open();
    if (data === undefined) {
      return;
    }

    await this.navigateWithQueryParams({ series: data });
  }

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  public async selectSortField(): Promise<void> {
    const currentSort = await this.getCurrentSort();
    const field = await this.selectSortActionSheetService.open(currentSort.field);
    if (field === undefined) {
      return;
    }

    await this.navigateWithQueryParams({ sort: field, order: currentSort.direction });
  }

  public async toggleSortDirection(): Promise<void> {
    const currentSort = await this.getCurrentSort();

    let newDirection = 'asc';
    if (currentSort.direction === 'asc') {
      newDirection = 'desc';
    }

    await this.navigateWithQueryParams({ sort: currentSort.field, order: newDirection });
  }

  private getCurrentSort(): Promise<AmiiboSortModel> {
    return this.selectedSort$.pipe(take(1)).toPromise();
  }

  /**
   * Reads the sort from the `sort` and `order` query params,
   * falling back to the defaults for missing or unknown values.
   */
  private parseSortParams(params: Params): AmiiboSortModel {
    let field = DEFAULT_AMIIBO_SORT.field;
    if (isAmiiboSortField(params.sort)) {
      field = params.sort;
    }

    let direction = DEFAULT_AMIIBO_SORT.direction;
    if (isAmiiboSortDirection(params.order)) {
      direction = params.order;
    }

    return { field, direction };
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Updates the given query params while keeping the others (e.g. changing the series keeps the sort).
   */
  private async navigateWithQueryParams(queryParams: Params): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  public async openAmiibo(slug: string): Promise<void> {
    await this.router.navigate(['/amiibo', slug]);
  }

  public toggleAmiibo({ slug, collected }: { slug: string, collected: boolean }): void {
    this.amiibosService.toggleAmiibo(slug, collected);
  }
}
