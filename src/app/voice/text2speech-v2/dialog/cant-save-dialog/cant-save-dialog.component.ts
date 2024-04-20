import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-cant-save-dialog',
  templateUrl: './cant-save-dialog.component.html',
  styleUrls: ['./cant-save-dialog.component.scss'],
})
export class CantSaveDialogComponent implements OnInit {
  public text = null;

  constructor(
    private dialogRef: MatDialogRef<CantSaveDialogComponent>,
    private _changeLanguage: ChangeLanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].text2speechObj.conver_mode.alert[3];
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  toSubPage() {
    this.router.navigate(['/payment']);
    this.dialogRef.close();
  }
}
