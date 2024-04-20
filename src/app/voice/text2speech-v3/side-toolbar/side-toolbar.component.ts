import { Component, HostListener, OnInit } from '@angular/core';
import {
  trigger,
  state,
  animate,
  transition,
  style,
} from '@angular/animations';

@Component({
  selector: 'app-side-toolbar',
  templateUrl: './side-toolbar.component.html',
  styleUrls: ['./side-toolbar.component.scss'],
  animations: [
    trigger('toggle', [
      state('true', style({ opacity: 1 })),
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('300ms ease-in-out')),
      transition(':leave', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SideToolbarComponent implements OnInit {
  textQuota: number = 1000;
  downloadPoint: number = 4500;
  maxTextQuota: number = 2000;
  maxDownloadPoint: number = 5000;

  textProgress = (this.textQuota / this.maxTextQuota) * 100;
  downloadPointProgress = (this.downloadPoint / this.maxDownloadPoint) * 100;

  expand = true;
  public screenWidth: any;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    // console.log(this.screenWidth);
    if (this.screenWidth <= 1000) {
      this.expand = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 1000) {
      this.expand = false;
    } else {
      this.expand = true;
    }
  }

  toggleExpand() {
    this.expand = !this.expand;
  }

  textProgressBar() {
    return {
      background: `linear-gradient(to right, #323130 ${this.textProgress}%, #F8F8F8 
      ${this.textProgress}%)`,
      'border-radius': '100px',
    };
  }

  downloadPointProgressBar() {
    return {
      background: `linear-gradient(to right, #323130 ${this.downloadPointProgress}%, #F8F8F8 
      ${this.downloadPointProgress}%)`,
      'border-radius': '100px',
    };
  }
}
