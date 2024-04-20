import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-navigate-dialog',
  templateUrl: './navigate-dialog.component.html',
  styleUrls: ['./navigate-dialog.component.scss']
})
export class NavigateDialogComponent implements OnInit {

  text = {
    title: 'เปลี่ยนแพ็กเกจ',
  }
  // data = null
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
  ) {

  }

  ngOnInit(): void {

  }

}
