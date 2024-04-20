import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogImage1Texts } from '../../models/dialog-model';

@Component({
  selector: 'app-dynamic-dialog-image1-texts',
  templateUrl: './dynamic-dialog-image1-texts.component.html',
  styleUrls: ['./dynamic-dialog-image1-texts.component.scss']
})
export class DynamicDialogImage1TextsComponent implements OnInit {

  textObj : DialogImage1Texts = {}

  constructor(
    @Inject(MAT_DIALOG_DATA) data: DialogImage1Texts,
    private dialogRef: MatDialogRef<DynamicDialogImage1TextsComponent>
  ) {
    this.textObj = data
  }

  ngOnInit(): void {

  }

  onClose(text:string){
    this.dialogRef.close(text)
  }

}
