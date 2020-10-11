import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class SubscriptionService implements OnDestroy {

  private subscriptions: Array<Subscription> = [];

  constructor() { }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public add(...subscriptions: Array<Subscription>): void {
    this.subscriptions = this.subscriptions.concat(subscriptions);
  }

}