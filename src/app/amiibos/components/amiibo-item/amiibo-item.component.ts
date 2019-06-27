import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AmiiboModel } from '../../services/AmiiboModel';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-amiibo-item',
  templateUrl: './amiibo-item.component.html',
  styleUrls: ['./amiibo-item.component.scss'],
})
export class AmiiboItemComponent {

  @Input()
  public amiibo: AmiiboModel;

  @Output()
  public collectedChanged: EventEmitter<boolean> = new EventEmitter();

  private expanded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private onClick(): void {
    this.expanded.next(!this.expanded.value);
  }

  private onCollectedChanged(collected: boolean): void {
    this.collectedChanged.next(collected);
  }

}
