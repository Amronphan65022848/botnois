import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogImage3Texts } from '../../models/dialog-model';

@Component({
  selector: 'app-dynamic-dialog-image3-texts',
  templateUrl: './dynamic-dialog-image3-texts.component.html',
  styleUrls: ['./dynamic-dialog-image3-texts.component.scss']
})
export class DynamicDialogImage3TextsComponent implements OnInit {

  textObj : DialogImage3Texts = {}

  constructor(
    @Inject(MAT_DIALOG_DATA) data: DialogImage3Texts,
    private dialogRef: MatDialogRef<DynamicDialogImage3TextsComponent>
  ) {
    this.textObj = data
  }

  ngOnInit(): void {

  }

  onClose(text:string){
    this.dialogRef.close({status:text})
  }

}
