import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectSeriesModalComponent } from './select-series-modal.component';

@Injectable()
export class SelectSeriesModalService {

  constructor(private readonly modalController: ModalController) {

  }

  public async open(): Promise<string> {
    const modal = await this.modalController.create({
      component: SelectSeriesModalComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }
}