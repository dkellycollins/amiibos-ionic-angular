import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmiiboModel } from '../../models/amiibo.model';

@Component({
  selector: 'app-amiibo-item',
  templateUrl: './amiibo-item.component.html',
  styleUrls: ['./amiibo-item.component.scss'],
})
export class AmiiboItemComponent {

  @Input()
  public amiibo: AmiiboModel;

  @Input()
  public collected: boolean;

  @Input()
  public expanded: boolean;

  @Output()
  public collectedChanged: EventEmitter<boolean> = new EventEmitter();

  /**
   * Emits when the item itself (not the toggle) is tapped.
   */
  @Output()
  public selected: EventEmitter<void> = new EventEmitter();

  public onClick(): void {
    this.selected.emit();
  }
}
