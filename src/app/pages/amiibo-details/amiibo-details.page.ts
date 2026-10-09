import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CollectableAmiiboModel } from 'src/app/amiibos/models/collectable-amiibo.model';
import { AmiibosService } from 'src/app/amiibos/services/amiibos.service';

/**
 * A link to search for the Amiibo at an online store.
 */
interface StoreLink {
  name: string;
  logoUrl: string;
  url: string;
}

/**
 * Everything the template needs to render the page.
 */
interface AmiiboDetailsViewModel {
  status: 'loading' | 'not-found' | 'found';
  amiibo?: CollectableAmiiboModel;
  releaseDate?: string;
  storeLinks?: Array<StoreLink>;
}

/**
 * Search page URLs for each store. The encoded search term is appended to each.
 */
const STORE_SEARCH_URLS: Array<StoreLink> = [
  {
    name: 'Amazon',
    logoUrl: 'assets/logos/amazon.svg',
    url: 'https://www.amazon.com/s?k='
  },
  {
    name: 'Target',
    logoUrl: 'assets/logos/target.svg',
    url: 'https://www.target.com/s?searchTerm='
  }
];

@Component({
  selector: 'app-amiibo-details',
  templateUrl: './amiibo-details.page.html',
  styleUrls: ['./amiibo-details.page.scss'],
})
export class AmiiboDetailsPage implements OnInit {

  public viewModel$: Observable<AmiiboDetailsViewModel>;

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private readonly locale: string
  ) { }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    // Ensures data is available when this page is opened directly or refreshed.
    this.amiibosService.loadAmiibos();

    const slug$ = this.activatedRoute.paramMap.pipe(
      map(params => {
        return params.get('slug');
      })
    );

    const amiibo$ = slug$.pipe(
      switchMap(slug => {
        return this.amiibosService.collectableAmiiboBySlug$(slug);
      })
    );

    this.viewModel$ = combineLatest([amiibo$, this.amiibosService.allAmiibos$]).pipe(
      map(([amiibo, allAmiibos]) => {
        return this.buildViewModel(amiibo, allAmiibos.length > 0);
      })
    );
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  public toggleAmiibo(slug: string, collected: boolean): void {
    this.amiibosService.toggleAmiibo(slug, collected);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private buildViewModel(amiibo: CollectableAmiiboModel | undefined, hasLoadedAmiibos: boolean): AmiiboDetailsViewModel {
    if (amiibo) {
      return {
        status: 'found',
        amiibo,
        releaseDate: this.formatReleaseDate(amiibo.releaseDate),
        storeLinks: this.buildStoreLinks(amiibo.name)
      };
    }

    if (hasLoadedAmiibos) {
      return { status: 'not-found' };
    }

    return { status: 'loading' };
  }

  /**
   * Formats the release date as a long date when it can be parsed,
   * otherwise returns the stored value unchanged.
   */
  private formatReleaseDate(releaseDate: string | undefined): string | undefined {
    if (!releaseDate) {
      return undefined;
    }

    const parsedDate = new Date(releaseDate);
    if (isNaN(parsedDate.getTime())) {
      return releaseDate;
    }

    return formatDate(parsedDate, 'longDate', this.locale);
  }

  /**
   * Builds a search link for each store, searching for "<name> amiibo".
   */
  private buildStoreLinks(amiiboName: string): Array<StoreLink> {
    const searchTerm = encodeURIComponent(`${amiiboName} amiibo`);

    return STORE_SEARCH_URLS.map(store => {
      return {
        name: store.name,
        logoUrl: store.logoUrl,
        url: store.url + searchTerm
      };
    });
  }
}
