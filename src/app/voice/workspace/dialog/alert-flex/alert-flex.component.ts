import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-flex',
  templateUrl: './alert-flex.component.html',
  styleUrls: ['./alert-flex.component.scss'],
})
export class AlertFlexComponent implements OnInit {
  public text = null;
  public icon = null;
  public iconColor = null;

  constructor(
    private dialogRef: MatDialogRef<AlertFlexComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.text = data.text[3];
    this.icon = data.icon;
    this.iconColor = data.icon_color;
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close(false);
  }

  toSubPage() {
    this.dialogRef.close(true);
  }
}
