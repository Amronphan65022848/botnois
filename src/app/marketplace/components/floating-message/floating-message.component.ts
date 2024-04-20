import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-floating-message',
  templateUrl: './floating-message.component.html',
  styleUrls: ['./floating-message.component.scss']
})
export class FloatingMessageComponent implements OnInit {
  @Input() alertMessage = [];
  @Input() sizeBox = 60;
  public windowWidth = window.innerWidth;
  public gap = 7;

  constructor() { }

  ngOnInit(): void {
    if (this.windowWidth < 600) this.gap = 7;
    else this.gap = 10;
  }

}
