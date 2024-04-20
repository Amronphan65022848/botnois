import { Component, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-remove-voice',
  templateUrl: './alert-remove-voice.component.html',
  styleUrls: ['./alert-remove-voice.component.scss'],
})
export class AlertRemoveVoiceComponent implements OnInit {
  text = language['TH'].removeVoiceObj;
  isChecked: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<AlertRemoveVoiceComponent>,
    private _changeLanguage: ChangeLanguageService
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].removeVoiceObj;
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
