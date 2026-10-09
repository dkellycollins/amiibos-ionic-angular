import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Toggle used to add or remove an Amiibo from the user's collection.
 */
@Component({
  selector: 'app-amiibo-collected-toggle',
  templateUrl: './amiibo-collected-toggle.component.html',
})
export class AmiiboCollectedToggleComponent implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------------
  // Inputs / outputs
  // ---------------------------------------------------------------------------

  /**
   * Sets the toggle state without emitting `collectedChanged`.
   */
  @Input()
  public set collected(value: boolean) {
    this.control.setValue(value, { emitEvent: false });
  }

  /**
   * Ionic color used when the toggle is on. Defaults to the theme's primary color.
   * Useful when the toggle sits on a background of the same color, such as a toolbar.
   */
  @Input()
  public color?: string;

  @Output()
  public collectedChanged: EventEmitter<boolean> = new EventEmitter();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  public control: FormControl = new FormControl(false);

  private subscriptions: Array<Subscription> = [];

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    const valueChangesSub = this.control.valueChanges.subscribe(value => {
      this.collectedChanged.emit(value);
    });

    this.subscriptions = [valueChangesSub];
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  /**
   * Prevents the click from reaching a parent element, such as a tappable list item.
   */
  public onClick(event: Event): void {
    event.stopPropagation();
  }
}
