import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { homeObj } from '../mocks/home-mock';
import { isLoadedOnHomeComponent } from '../models/home-model';

@Injectable({
  providedIn: 'root'
})
export class ComponentQueueService {

  $componentsLoaded = new BehaviorSubject<number>(null)
  constructor() {

  }
}
