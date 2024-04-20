import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as Zip from 'jszip';

import { saveAs } from 'file-saver';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';

@Component({
  selector: 'app-audio-download-select',
  templateUrl: './audio-download-select.component.html',
  styleUrls: ['./audio-download-select.component.scss'],
})
export class AudioDownloadSelectComponent implements OnInit, OnDestroy {
  public isDownloading = true;
  public confirmDownload = false;

  public queue_download: any = [];
  public successValue: any = 0;

  //#-----------------------------[Change Language]--------------------------------#

  public confirmDownloadText = 'ยืนยันการดาวน์โหลดไฟล์เสียง';
  public cancel = 'ยกเลิก';
  public accept = 'ยืนยัน';
  public downloadAll_ = 'ดาวน์โหลดไฟล์ทั้งหมด';
  public downloadSuccess = 'ดาวน์โหลดเสร็จสิ้น';
  public file_ = 'ไฟล์';
  public success = 'เสร็จสิ้น';

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private speechService: TextspeechService,
    public dialogRef: MatDialogRef<AudioDownloadSelectComponent>,
    public dialog: MatDialog,
    private _changelanguage: ChangeLanguageService,
  ) {
    this.queue_download = data.queue_download;
  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangelanguage(res);
      }
    });
  }
  ngOnDestroy(): void {
    this.queue_download.map((e) => (e.success = false));
  }

  getsliceText(text: string, type_media: string) {
    let Allword = text;
    Allword = Allword.slice(0, 30) + '.' + type_media;
    return Allword;
  }

  downloadAudio(data: Blob, file_name: string, file_Type: string) {
    return new Blob([data], { type: 'audio/' + file_Type });
  }

  async downloadAll() {
    // const zip = new Zip();
    this.confirmDownload = true;
    for (let i = 0; i < this.queue_download.length; i++) {
      const queue = this.queue_download[i];
      console.log(queue);

      const file = queue.text + '.' + queue.type_media;
      saveAs(queue.url, file);
      this.queue_download[i].success = true;
      this.successValue++;

      // const res = await this._audioStorageApi.getOneStorage(this.queue_download[i].url,this._auth.data.getValue().user_id).toPromise();
      // console.log(res)
      // this.queue_download[i].file = this.downloadAudio(res, this.queue_download[i].text, this.queue_download[i].type_media)
      // this.queue_download[i].success = true;
      // this.successValue++
      // const name = this.queue_download[i].text.length > 30 ? this.queue_download[i].text.slice(0, 30) + "..." : this.queue_download[i].text;
      // const file_name = i + 1 + ". " + name + "." + this.queue_download[i].type_media;

      // zip.file(file_name, this.queue_download[i].file);
      // if (i == this.queue_download.length - 1) {
      //   var d = new Date().toLocaleString()
      //   const name_zip = "ดาวน์โหลดเสียงทั้งหมด " + this.queue_download.length + " ไฟล์ " + d + ".zip"
      //   zip.generateAsync({ type: 'blob' }).then(function (content) {
      //     saveAs(content, name_zip);
      //   })
      //   this.isDownloading = false;
      // }
    }
  }

  text = TH.audioDownloadObj;

  get_dataChangelanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.audioDownloadObj;
    } else if (temp == 'EN') {
      this.text = EN.audioDownloadObj;
    }
    this.getdataInfo();
  }

  getdataInfo() {
    this.confirmDownloadText = this.text.confirmDownload;
    this.cancel = this.text.cancel;
    this.accept = this.text.accept;
    this.downloadAll_ = this.text.downloadAll;
    this.downloadSuccess = this.text.downloadSuccess;
    this.file_ = this.text.file_;
    this.success = this.text.success;
  }
}
