import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
// import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.css'],
})
export class DialogSuccessComponent implements OnInit {
  step: number = 1;
  text = null;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogSuccessComponent>,

    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changelanguage: ChangeLanguageService
  ) {}

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].dialogMessageObj;
      }
    });
  }
}
