import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { mock_svg } from '../mocks/image-mock';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  /** Generate svg image to use it with Mat-Icon */
  generateSVG(){
    const svg = mock_svg
    Object.keys(svg).forEach(
      key => {
        this.iconRegistry.addSvgIconLiteral(key, this.sanitizer.bypassSecurityTrustHtml(svg[key]));
      }
    )
  }

  getIcon(iconName: string) {
    return this.iconRegistry.getNamedSvgIcon(iconName)
  }
}
