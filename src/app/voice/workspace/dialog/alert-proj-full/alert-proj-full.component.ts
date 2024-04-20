import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';

@Component({
  selector: 'app-alert-proj-full',
  templateUrl: './alert-proj-full.component.html',
  styleUrls: ['./alert-proj-full.component.scss'],
})
export class AlertProjFullComponent implements OnInit {
  public text = null;

  constructor(
    private dialogRef: MatDialogRef<AlertProjFullComponent>,
    private _changeLanguage: ChangeLanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].workspaceObj.alertDialog[0];
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
