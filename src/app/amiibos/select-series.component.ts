import { Component, OnInit } from '@angular/core';
import { AmiibosService } from './amiibos.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-series',
  templateUrl: './select-series.component.html',
})
export class SelectSeriesComponent implements OnInit {

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
