import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { AmiiboModel } from '../../amiibos/services/AmiiboModel';
import { AmiibosService } from '../../amiibos/services/amiibos.service';
import { UserAmiibosService } from '../../amiibos/services/user-amiibos.service';
import { SelectSeriesModalComponent } from '../../amiibos/components/select-series-modal/select-series-modal.component';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';
import { Select, Store } from '@ngxs/store';
import { AmiibosState } from 'src/app/amiibos/state/amiibos.state';
import { AmiibosActions } from 'src/app/amiibos/state/amiibos.actions';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
})
export class AmiibosPage implements OnInit {

  @Select(AmiibosState.selectedAmiibos)
  public readonly amiibos$: Observable<Array<AmiiboModel>>;

  @Select(AmiibosState.selectedSeries)
  public readonly selectedSeries$: Observable<string>;

  public amiibosLength$: Observable<number>;
  public collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;
  public collectedAmiibosCount$: Observable<number>;
  public progress$: Observable<number>;

  public constructor(
    private readonly store: Store,
    private readonly userAmiibosService: UserAmiibosService,
    private readonly selectSeriesModalService: SelectSeriesModalService
  ) { }

  public ngOnInit() {
    this.collectedAmiibos$ = combineLatest(this.amiibos$, this.userAmiibosService.getCollectedAmiibos()).pipe(
      map(([amiibos, collectedAmiibos]) => amiibos.map(amiibo => ({ ...amiibo, isCollected: collectedAmiibos.indexOf(amiibo.slug) >= 0}))),
    );

    this.amiibosLength$ = this.amiibos$.pipe(
      map(amiibos => amiibos.length),
    );

    this.collectedAmiibosCount$ = this.collectedAmiibos$.pipe(
      map(collectedAmiibos => collectedAmiibos.filter(amiibo => amiibo.isCollected).length),
    );

    this.progress$ = combineLatest(this.amiibosLength$, this.collectedAmiibosCount$).pipe(
      map(([amiibosLength, collectedAmiibosCount]) => amiibosLength === 0 ? 0 : collectedAmiibosCount / amiibosLength),
    );

    this.store.dispatch(new AmiibosActions.LoadAmiibos());
  }

  public async selectSeries(): Promise<void> {
    const data = await this.selectSeriesModalService.open();
    this.store.dispatch(new AmiibosActions.SelectSeries(data));
  }

  public toggleAmiibo({ slug, collected }: { slug: string, collected: boolean }): void {
    this.userAmiibosService.toggleAmiibo(slug, collected);
  }
}
