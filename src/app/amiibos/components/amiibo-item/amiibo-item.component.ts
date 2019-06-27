import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AmiiboModel } from '../../services/AmiiboModel';

@Component({
  selector: 'app-amiibo-item',
  templateUrl: './amiibo-item.component.html',
  styleUrls: ['./amiibo-item.component.scss'],
})
export class AmiiboItemComponent {

  @Input()
  public amiibo: AmiiboModel;

  @Input()
  public expanded: boolean = false;

  @Output()
  public click: EventEmitter<void> = new EventEmitter();

  @Output()
  public collectedChanged: EventEmitter<boolean> = new EventEmitter();

  public onClick(): void {
    this.click.next();
  }

  public onCollectedChanged(collected: boolean): void {
    this.collectedChanged.next(collected);
  }

}
