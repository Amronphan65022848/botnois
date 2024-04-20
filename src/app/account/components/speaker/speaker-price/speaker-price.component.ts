import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-speaker-price',
  templateUrl: './speaker-price.component.html',
  styleUrls: ['./speaker-price.component.scss']
})
export class SpeakerPriceComponent implements OnInit {

  text = {
    placeholder: 'กรอกจำนวนพอยท์',
    submit: 'บันทึก',
  }

  point = new FormControl(1,[
    Validators.min(1),
    Validators.required
  ])

  constructor(
    private dialogRef: MatDialogRef<SpeakerPriceComponent>,
  ) { }

  ngOnInit(): void {

  }

  /* Get number from input and close dialog */
  onSubmit(point:number){
    this.dialogRef.close(point)
  }

}
