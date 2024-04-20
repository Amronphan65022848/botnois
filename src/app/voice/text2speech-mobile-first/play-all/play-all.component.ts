import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudioMobileService } from 'src/app/shared/services/studio-mobile.service';

@Component({
  selector: 'app-play-all',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './play-all.component.html',
  styleUrl: './play-all.component.scss',
})
export class PlayAllComponent {
  text = null;
  isPlaying = false;

  currentTime = 0;
  duration = 0;

  constructor(private _studioMobile: StudioMobileService) {}

  playAll() {
    this._studioMobile.playAllClicked();
  }

  onSliderInput($event) {}
}
