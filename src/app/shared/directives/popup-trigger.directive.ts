import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appPopupTrigger]',
})
export class PopupTriggerDirective {
  @Input('appPopupTrigger') popup: HTMLElement;

  constructor(private renderer: Renderer2) {}

  @HostListener('mouseenter')
  showPopup() {
    // Use the Renderer2 to manipulate the DOM element
    this.renderer.setStyle(this.popup, 'display', 'block');
  }

  @HostListener('mouseleave')
  hidePopup() {
    // Use the Renderer2 to manipulate the DOM element
    this.renderer.setStyle(this.popup, 'display', 'none');
  }
}
