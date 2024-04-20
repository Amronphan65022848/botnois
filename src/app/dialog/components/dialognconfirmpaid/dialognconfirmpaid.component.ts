import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { MatSelectChange } from '@angular/material/select';
import { TResponseConfirmPaid } from 'src/app/voice/models/voice-model';

@Component({
  selector: 'app-dialognconfirmpaid',
  templateUrl: './dialognconfirmpaid.component.html',
  styleUrls: ['./dialognconfirmpaid.component.scss'],
})
export class DialognconfirmpaidComponent implements OnInit {
  value: any;
  formatType = [];
  public fileType: any;
  public step: number;
  public on_click: boolean = false;
  isSlideToggle = false;
  subscription = null;
  isSaveFile = false;
  canSaveFile = true;
  downloadState = '';
  public numBox = [
    {
      name: '1',
      status: 'true',
    },
    {
      name: '2',
      status: 'true',
    },
    {
      name: '3',
      status: 'false',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<
      DialognconfirmpaidComponent,
      TResponseConfirmPaid
    >,
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

    /* detect state changed */
    this._tts.$isSlideToggle.subscribe((res) => (this.isSlideToggle = res));

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
    this.step = 1;
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangeLanguage(res);
      }
    });
    this.getLocalStorage();
  }

  onChangeSave(ev: MatSelectChange) {
    localStorage.setItem('storage_save', ev.value);
  }

  // Get storage save status from Localstorage
  getLocalStorage() {
    // this.isSaveFile =
    // localStorage.getItem('storage_save') === 'true' ? true : false;

    //** Temp */
    this.isSaveFile = false;
  }

  close_dialog(fileType: any) {
    /* pass state to var */
    this._tts.$isSlideToggle.next(this.isSlideToggle);
    this.dialogRef.close({
      file_type: fileType,
      isMergeAudio: this.isSlideToggle,
      saveFiles: this.isSaveFile,
    });
  }

  onChangefileType() {
    this.on_click = true;
  }

  text = TH.dialogconfirmObj;

  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.dialogconfirmObj;
    } else if (temp == 'EN') {
      this.text = EN.dialogconfirmObj;
    }
  }
}
