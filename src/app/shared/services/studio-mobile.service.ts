import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudioMobileService {
  private playAllClickedSource = new Subject<void>();
  playAllClicked$ = this.playAllClickedSource.asObservable();

  private selectedBoxes = signal<number>(0);

  constructor() {}

  setSelectedBoxes(num: number) {
    this.selectedBoxes.set(num);
  }

  getSelectedBoxes() {
    return this.selectedBoxes();
  }

  playAllClicked() {
    this.playAllClickedSource.next();
  }
}
