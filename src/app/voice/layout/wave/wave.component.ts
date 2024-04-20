import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wave',
  templateUrl: './wave.component.html',
  styleUrls: ['./wave.component.scss'],
})


export class WaveComponent {
  public items = [1, 2, 3, 4, 5]
  @Input() isPlaying: boolean
  constructor() {}

}
