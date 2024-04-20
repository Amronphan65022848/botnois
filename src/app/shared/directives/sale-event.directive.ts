import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Directive({
  selector: '[appSaleEvent]',
  standalone: true,
})
export class SaleEventDirective {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private _notify: NotificationService,
  ) {
    const isEvent = !this._notify.notifyJson.getValue()?.personal_form;
    // If not in event time
    if (isEvent) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none'); // Initially hide the element
    }
  }
}

@Directive({
  selector: '[appNonEvent]',
  standalone: true,
})
export class NonEventDirective {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private _notify: NotificationService,
  ) {
    const isEvent = !this._notify.notifyJson.getValue()?.personal_form;
    // If in event time
    if (!isEvent) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none'); // Initially hide the element
    }
  }
}
