import { Component } from '@angular/core';
import { StudioMobileService } from 'src/app/shared/services/studio-mobile.service';

@Component({
  selector: 'app-total-box',
  standalone: true,
  imports: [],
  templateUrl: './total-box.component.html',
  styleUrl: './total-box.component.scss',
})
export class TotalBoxComponent {
  constructor(private _stuioMobile: StudioMobileService) {}

  getTotalBoxes() {
    return this._stuioMobile.getSelectedBoxes();
  }
}
