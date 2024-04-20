import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSetElementId]',
  standalone: true,
})
export class SetElementIdDirective {
  @Input('appSetElementId') id: string;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    this.setChildElementId(element, this.id);
  }

  private setChildElementId(element: HTMLElement, id: string) {
    // Add the ID to the current element
    element.id = id;

    // Recursively set the same ID to all child elements
    const childElements = element.children;
    for (let i = 0; i < childElements.length; i++) {
      const childElement = childElements[i] as HTMLElement;

      this.setChildElementId(childElement, id);
    }
  }
}
