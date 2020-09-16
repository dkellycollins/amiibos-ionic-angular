import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { AmiiboModel } from '../../amiibos/services/AmiiboModel';
import { AmiibosService } from '../../amiibos/services/amiibos.service';
import { UserAmiibosService } from '../../amiibos/services/user-amiibos.service';
import { SelectSeriesModalComponent } from '../../amiibos/components/select-series-modal/select-series-modal.component';
import { SelectSeriesModalService } from 'src/app/amiibos/components/select-series-modal/select-series-modal.service';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
})
export class AmiibosPage implements OnInit {

  public selectedSeries$: Subject<string> = new BehaviorSubject('All Amiibos');

  public amiibos$: Observable<Array<AmiiboModel>>;
  public amiibosLength$: Observable<number>;
  public collectedAmiibos$: Observable<Array<AmiiboModel & { isCollected: boolean }>>;
  public collectedAmiibosCount$: Observable<number>;
  public progress$: Observable<number>;

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly userAmiibosService: UserAmiibosService,
    private readonly selectSeriesModalService: SelectSeriesModalService
  ) { }

  public ngOnInit() {
    this.amiibos$ = this.selectedSeries$.pipe(
      filter(series => !!series),
      switchMap(series => series === 'All Amiibos' ? this.amiibosService.getAmiibos() : this.amiibosService.getAmiibosBySeries(series)),
      shareReplay(1),
    );

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
  }

  public async selectSeries(): Promise<void> {
    const data = await this.selectSeriesModalService.open();
    this.selectedSeries$.next(data);
  }

  public toggleAmiibo({ slug, collected }: { slug: string, collected: boolean }): void {
    this.userAmiibosService.toggleAmiibo(slug, collected);
  }
}
