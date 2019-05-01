import { Component, OnInit } from '@angular/core';
import { AmiibosService, AmiiboModel } from './amiibos.service';
import { ModalController } from '@ionic/angular';
import { SelectSeriesComponent } from './select-series.component';

@Component({
  selector: 'app-amiibos',
  templateUrl: './amiibos.page.html',
})
export class AmiibosPage implements OnInit {

  public selectedSeries: string = 'All Amiibos';
  public amiibos: Array<AmiiboModel> = [];
  public collectedAmiibos: { [slug: string]: boolean } = {};

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly modalController: ModalController
  ) { }

  public ngOnInit() {
    this.amiibos = this.amiibosService.getAmiibos();
  }

  public async selectSeries(): Promise<void> {
    const modal = await this.modalController.create({
      component: SelectSeriesComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data === 'All') {
      this.selectedSeries = 'All Amiibos';
      this.amiibos = this.amiibosService.getAmiibos();
    }
    else if (data !== undefined) {
      this.selectedSeries = data;
      this.amiibos = this.amiibosService.getAmiibosBySeries(data);
    }
  }

  public isCollected(slug: string): boolean {
    return this.collectedAmiibos[slug] || false;
  }

  public toggleAmiibo(slug: string, $event: any): void {
    console.log($event);
    this.collectedAmiibos[slug] = !this.collectedAmiibos[slug];
  }

  public getCollectedAmiibos(): number {
    return this.amiibos
      .filter(amiibo => !!this.collectedAmiibos[amiibo.slug])
      .length;
  }

  public getProgress(): number {
    if (this.amiibos.length === 0) {
      return 0;
    }

    return this.getCollectedAmiibos() / this.amiibos.length;
  }
}
