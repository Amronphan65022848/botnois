import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
type Data = {
  type: 'NO_POINT_DOWNLOAD',
}
@Component({
  selector: 'app-no-point-dialog',
  templateUrl: './no-point-dialog.component.html',
  styleUrls: ['./no-point-dialog.component.scss'],
})



export class NoPointDialogComponent implements OnInit {
  public text = null;
  data: Data = null
  constructor(
    private dialogRef: MatDialogRef<NoPointDialogComponent>,
    private _changeLanguage: ChangeLanguageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private _data: Data | null,
  ) {
    this.data = this._data
  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].text2speechObj.conver_mode.alert[2];
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this.data?.type !== 'NO_POINT_DOWNLOAD') {
      this.router.navigate(['/payment'], { queryParams: { page: 0 } });
      this.dialogRef.close();
    } else {
      this.dialogRef.close(true);
    }

  }
}
