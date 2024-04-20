import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';

@Component({
  selector: 'app-download-sigle',
  standalone: true,
  imports: [MatSelectModule, FormsModule, CommonModule, MatSlideToggle],
  templateUrl: './download-sigle.component.html',
  styleUrl: './download-sigle.component.scss',
})
export class DownloadSigleComponent {
  text = null;
  formatType = [];
  public on_click: boolean = false;
  public fileType: any;
  isSaveFile = false;
  canSaveFile = true;
  isSlideToggle = false;
  value: any;
  subscription = null;
  downloadState = '';

  constructor(
    public dialogRef: MatDialogRef<DownloadSigleComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _tts: TextspeechService,
    private _changeLanguage: ChangeLanguageService,
    private _notify: NotificationService,
  ) {
    this._notify.notifyJson.subscribe((res) => {
      const file_type = res.file_type;
      this.formatType = file_type;
      /* change index 0 on db will change default file type */
      this.fileType = file_type[0];
    });

    if (data.download == 'all') {
      this.value = data.point;
      this.downloadState = data.download;
    } else if (data.subscription) {
      const sub = String(data.subscription);
      this.subscription = sub;

      if (sub === 'Unlimited') {
        this.canSaveFile = false;
      }
      this.value = data.point;
    } else {
      this.value = data;
    }
  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].dialogconfirmObj;
      }
    });
    this.getLocalStorage();
  }

  onChangeSave(ev: MatSelectChange) {
    localStorage.setItem('storage_save', ev.value);
  }

  getLocalStorage() {
    this.isSaveFile =
      localStorage.getItem('storage_save') === 'true' ? true : false;
  }

  close_dialog(fileType: any) {
    /* pass state to var */
    this._tts.$isSlideToggle.next(this.isSlideToggle);
    this.dialogRef.close({
      type: 'download',
      file_type: fileType,
      isMergeAudio: this.isSlideToggle,
      saveFiles: this.isSaveFile,
    });
  }

  onChangefileType() {
    this.on_click = true;
  }
}
