import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-toolbar',
  templateUrl: './progress-toolbar.component.html',
  styleUrls: ['./progress-toolbar.component.scss'],
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
    return this.count / this.total;
  }
}
