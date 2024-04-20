import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Data {
  icon: string
  text: string
  icon_color: string
}

@Component({
  selector: 'app-flex-dialog',
  templateUrl: './flex-dialog.component.html',
  styleUrls: ['./flex-dialog.component.scss'],
})
export class FlexDialogComponent implements OnInit {

  text = null
  constructor(
    private dialogRef: MatDialogRef<FlexDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
  ) {
    this.text = data?.text
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
