import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AmiibosState } from '../../state/amiibos.state';

@Component({
  templateUrl: './select-series-modal.component.html',
})
export class SelectSeriesModalComponent {
  @Select(AmiibosState.series)
  public readonly series$: Observable<Array<string>>;

  public constructor(private readonly modalController: ModalController) {}

  public select(series: string): void {
    this.modalController.dismiss(series);
  }

  public cancel(): void {
    this.modalController.dismiss();
  }
}
