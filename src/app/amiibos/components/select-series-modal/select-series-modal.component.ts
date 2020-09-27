import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AmiibosSelectors } from '../../state/amiibos.selectors';

@Component({
  templateUrl: './select-series-modal.component.html',
})
export class SelectSeriesModalComponent {
  @Select(AmiibosSelectors.series)
  public readonly series$: Observable<Array<string>>;

  public constructor(private readonly modalController: ModalController) {}

  public select(series: string): void {
    this.modalController.dismiss(series);
  }

  public cancel(): void {
    this.modalController.dismiss();
  }
}
