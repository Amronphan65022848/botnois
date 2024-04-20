import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Data {
  title: string
  label: string
  btn: string
  confirm_text: string
}

@Component({
  selector: 'app-confirm-text',
  templateUrl: './confirm-text.component.html',
  styleUrls: ['./confirm-text.component.scss']
})
export class ConfirmTextComponent implements OnInit {
  data!: Data
  inputText = new FormControl<any>('')
  constructor(
    @Inject(MAT_DIALOG_DATA) data: Data,
  ) {
    this.data = data
  }

  ngOnInit(): void {

  }

}

