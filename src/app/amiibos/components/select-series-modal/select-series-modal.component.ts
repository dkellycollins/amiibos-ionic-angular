import { Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AmiibosStore } from '../../services/amiibos.store';

@Component({
  templateUrl: './select-series-modal.component.html',
})
export class SelectSeriesModalComponent {
  public readonly series$: Observable<Array<string>>;

  public constructor(
    private readonly modalController: ModalController,
    private readonly amiibosStore: AmiibosStore
  ) {
    this.series$ = toObservable(this.amiibosStore.series);
  }

  public select(series: string): void {
    this.modalController.dismiss(series);
  }

  public cancel(): void {
    this.modalController.dismiss();
  }
}
