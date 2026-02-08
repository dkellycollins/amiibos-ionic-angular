import { Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ModalController, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AmiibosStore } from '../../services/amiibos.store';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    templateUrl: './select-series-modal.component.html',
    standalone: true,
    imports: [
        IonicModule,
        NgFor,
        AsyncPipe,
    ],
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
