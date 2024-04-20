import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-try-full',
  templateUrl: './try-full.component.html',
  styleUrls: ['./try-full.component.scss'],
})
export class TryFullComponent {
  text = null;
  state: string = null;

  constructor(
    private dialogRef: MatDialogRef<TryFullComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.text = data?.text;
    this.state = data?.state;
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
