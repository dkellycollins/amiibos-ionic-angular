import { Component, OnInit } from '@angular/core';
import { AmiibosService } from '../services/amiibos.service';
import { ModalController } from '@ionic/angular';
import { AmiiboModel } from '../services/AmiiboModel';
import { SelectSeriesModalComponent } from './select-series-modal.component';
import { UserAmiibosService } from '../services/user-amiibos.service';
import { ToggleChangeEventDetail } from '@ionic/core';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

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
    private readonly modalController: ModalController
  ) { }

  public ngOnInit() {
    this.amiibos$ = this.selectedSeries$.pipe(
      filter(series => !!series),
      map(series => series === 'All Amiibos' ? this.amiibosService.getAmiibos() : this.amiibosService.getAmiibosBySeries(series)),
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

  public getAmiiboId(amiibo: AmiiboModel): string {
    return amiibo.slug;
  }

  public async selectSeries(): Promise<void> {
    const modal = await this.modalController.create({
      component: SelectSeriesModalComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.selectedSeries$.next(data);
  }

  public toggleAmiibo(slug: string, $event: CustomEvent<ToggleChangeEventDetail>): void {
    this.userAmiibosService.toggleAmiibo(slug, $event.detail.checked);
  }
}
