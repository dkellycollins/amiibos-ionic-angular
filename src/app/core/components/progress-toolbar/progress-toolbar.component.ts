import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
    selector: 'app-progress-toolbar',
    templateUrl: './progress-toolbar.component.html',
    styleUrls: ['./progress-toolbar.component.scss'],
    standalone: true,
    imports: [IonicModule, ProgressBarComponent],
})
export class ProgressToolbarComponent {

  @Input()
  public count: number;

  @Input()
  public total: number;

  public get progress(): number {
    if (this.total === 0) {
      return 0;
    }
    return (this.count / this.total) * 100;
  }
}
