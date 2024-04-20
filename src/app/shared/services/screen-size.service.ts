import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { defineDeviceBaseOnPage } from 'src/app/voice/mocks/conversation-mock';
import { ScreenSize, Device } from 'src/app/model/core-model';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  screenSize = new BehaviorSubject<ScreenSize>(null);

  /* specify which device the user uses */
  $device = new BehaviorSubject<Device>(null);
  constructor(private _gfunc: GlobalFunctionService) {
    /* call once to get screen size */
    this.getScreenSize();
  }

  /** Get current screen size on browser. */
  getScreenSize() {
    this.screenSize.next({
      width: String(window.innerWidth) + 'px',
      height: String(window.innerHeight) + 'px',
    });

    this.defineDevice(window.innerWidth);
  }

  /** Identify whice device by calcalute its width.  */
  defineDevice(width: number) {
    /* format vars */
    // const width = Number(width_str.replace('px',''))

    // Get url path and remove query params
    const currentPage = this._gfunc.getUrlPath().split('?')[0];

    /* assgin temp vars */
    const pageName = defineDeviceBaseOnPage[currentPage];

    if (pageName) {
      const desktop = pageName.desktop;
      const tablet = pageName.tablet;
      if (width > desktop) this.$device.next('Desktop');
      else if (width > tablet) this.$device.next('Tablet');
      else this.$device.next('Mobile');
    }
  }

  getSize() {
    return {
      width: Number(window.innerWidth),
      height: Number(window.innerHeight),
    };
  }
}
