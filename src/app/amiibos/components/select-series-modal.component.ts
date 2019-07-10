import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AmiibosService } from '../services/amiibos.service';

@Component({
  templateUrl: './select-series-modal.component.html',
})
export class SelectSeriesModalComponent implements OnInit {

  public series: Array<string> = [];

  public constructor(
    private readonly amiibosService: AmiibosService,
    private readonly modalController: ModalController
  ) { }

  public ngOnInit() {
    this.series = this.amiibosService.getAmiiboSeries();
  }

  public select(series: string): void {
    this.modalController.dismiss(series);
  }

  public cancel(): void {
    this.modalController.dismiss();
  }
}
