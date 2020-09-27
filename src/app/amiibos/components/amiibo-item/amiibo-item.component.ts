import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { ToggleChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AmiiboModel } from '../../models/amiibo.model';

@Component({
  selector: 'app-amiibo-item',
  templateUrl: './amiibo-item.component.html',
  styleUrls: ['./amiibo-item.component.scss'],
})
export class AmiiboItemComponent implements OnInit, OnDestroy {

  @Input()
  public amiibo: AmiiboModel;

  @Input()
  public get collected(): boolean {
    return this.control.value();
  }
  public set collected(value: boolean) {
    this.control.setValue(value, { emitEvent: false });
  }

  @Input()
  public expanded: boolean;

  @Output()
  public collectedChanged: EventEmitter<boolean>;

  public control: AbstractControl;

  private subscriptions: Array<Subscription>;

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
    this.collectedChanged = new EventEmitter();
    this.control = this.formBuilder.control(false);
  }

  public ngOnInit(): void {
    const valueChangesSub = this.control.valueChanges.subscribe(value => this.collectedChanged.emit(value));

    this.subscriptions = [valueChangesSub];
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
