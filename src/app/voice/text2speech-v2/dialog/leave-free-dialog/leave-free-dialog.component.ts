import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-leave-free-dialog',
  templateUrl: './leave-free-dialog.component.html',
  styleUrls: ['./leave-free-dialog.component.scss'],
})
export class LeaveFreeDialogComponent implements OnInit {
  text = language['TH'].leavePageObj;

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private dialogRef: MatDialogRef<LeaveFreeDialogComponent>
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].leavePageObj;
      }
    });
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
