import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleChangeEventDetail } from '@ionic/core';
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
  public collected = false;

  @Input()
  public expanded = false;

  @Output()
  public click: EventEmitter<void> = new EventEmitter();

  @Output()
  public collectedChanged: EventEmitter<boolean> = new EventEmitter();

  public onClick(): void {
    this.click.next();
  }

  public onCollectedChanged($event: CustomEvent<ToggleChangeEventDetail>): void {
    this.collectedChanged.next($event.detail.checked);
  }
}
