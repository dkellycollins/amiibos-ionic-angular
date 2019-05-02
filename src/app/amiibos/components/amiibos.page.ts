import { Component, OnInit, EventEmitter } from '@angular/core';
import { AmiibosService } from '../services/amiibos.service';
import { ModalController, IonToggle } from '@ionic/angular';
import { AmiiboModel } from '../services/AmiiboModel';
import { SelectSeriesModalComponent } from './select-series-modal.component';
import { UserAmiibosService } from '../services/user-amiibos.service';
import { ToggleChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
})
export class AmiibosPage {

  public selectedSeries = 'All Amiibos';
  public amiibos: Array<AmiiboModel> = this.amiibosService.getAmiibos();

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly userAmiibosService: UserAmiibosService,
    private readonly modalController: ModalController
  ) { }

  public async selectSeries(): Promise<void> {
    const modal = await this.modalController.create({
      component: SelectSeriesModalComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data === 'All') {
      this.selectedSeries = 'All Amiibos';
      this.amiibos = this.amiibosService.getAmiibos();
    } else if (data !== undefined) {
      this.selectedSeries = data;
      this.amiibos = this.amiibosService.getAmiibosBySeries(data);
    }
  }

  public isCollected(slug: string): boolean {
    return this.userAmiibosService.getCollectedAmiibos().indexOf(slug) >= 0;
  }

  public toggleAmiibo(slug: string, $event: CustomEvent<ToggleChangeEventDetail>): void {
    console.log($event);
    this.userAmiibosService.toggleAmiibo(slug, $event.detail.checked);
  }

  public getCollectedAmiibosCount(): number {
    const collectedAmiibos = this.userAmiibosService.getCollectedAmiibos();
    return this.amiibos
      .filter(amiibo => collectedAmiibos.indexOf(amiibo.slug) >= 0)
      .length;
  }

  public getProgress(): number {
    if (this.amiibos.length === 0) {
      return 0;
    }

    return this.getCollectedAmiibosCount() / this.amiibos.length;
  }
}
