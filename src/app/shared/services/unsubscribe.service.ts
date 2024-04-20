import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs'
@Injectable({
  providedIn: 'root'
})

// Unsubscribe service for handle memory leaks
export class UnsubscribeService {
  protected subscriptions: Subscription[] = [];
  $destroy = new Subject()
  constructor() { }

  /**
   * Add a subscription to the list for storing.
   * @param subscription: Subscribe array data.
   */
  add(subscription: Subscription[]): void {
    this.subscriptions = subscription;
  }

  complete() {
    this.$destroy.next('')
    this.$destroy.complete()
  }
  /**
   * Unsubscribe from all stored subscriptions.
   */
  unsubscribeAll(): void {
    // Loop variable to each unsubscribe
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    // Reset variable
    this.subscriptions = []
  }
}
