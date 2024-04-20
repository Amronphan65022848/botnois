import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-alert-edit-name',
  templateUrl: './alert-edit-name.component.html',
  styleUrls: ['./alert-edit-name.component.scss'],
})
export class AlertEditNameComponent implements OnInit {
  public text = null;
  public changedName: string = '';
  public type = null;

  constructor(
    private dialogRef: MatDialogRef<AlertEditNameComponent>,
    private _changeLanguage: ChangeLanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = data.type;
  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].workspaceObj.alertDialog[1];
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.changedName);
  }
}
