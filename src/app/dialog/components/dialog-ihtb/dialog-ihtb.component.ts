import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-ihtb',
  templateUrl: './dialog-ihtb.component.html',
  styleUrls: ['./dialog-ihtb.component.scss']
})
export class DialogIHTBComponent implements OnInit {

  /*
    I = Image
    H = Header
    T = Text
    B = Button
  */

  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {

  }

}
