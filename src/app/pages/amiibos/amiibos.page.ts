import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';
import { CollectionProgressModel } from 'src/app/amiibos/models/collection-progress.model';
import { AmiibosActions } from 'src/app/amiibos/state/amiibos.actions';
import { AmiibosState } from 'src/app/amiibos/state/amiibos.state';
import { AmiiboModel } from '../../amiibos/models/amiibo.model';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
})
export class AmiibosPage implements OnInit {

  @Select(AmiibosState.selectedAmiibos)
  public readonly amiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosState.selectedSeries)
  public readonly selectedSeries$: Observable<string>;

  @Select(AmiibosState.collectedAmiibos)
  public readonly collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;

  @Select(AmiibosState.progress)
  public readonly progress$: Observable<CollectionProgressModel>;

  public constructor(
    private readonly store: Store,
    private readonly selectSeriesModalService: SelectSeriesModalService
  ) { }

  public ngOnInit() {
    this.store.dispatch(new AmiibosActions.LoadAmiibos());
  }

  public async selectSeries(): Promise<void> {
    const data = await this.selectSeriesModalService.open();
    this.store.dispatch(new AmiibosActions.SelectSeries(data));
  }

  public toggleAmiibo({ slug, collected }: { slug: string, collected: boolean }): void {
    console.log(arguments);
    this.store.dispatch(new AmiibosActions.ToggleAmiibo(slug, collected));
  }
}
