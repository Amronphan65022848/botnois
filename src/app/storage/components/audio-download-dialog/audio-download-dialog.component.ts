import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AudioStorageApiService } from 'src/app/storage/services/audio-storage-api.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { saveAs } from 'file-saver';
import { Voice_data } from 'src/app/shared/models/shared-model';

@Component({
  templateUrl: './audio-download-dialog.component.html',
  styleUrls: ['./audio-download-dialog.component.scss']
})
export class AudioDownloadDialogComponent implements OnInit {

  fileType = ['.wav', '.mp3']
  selectedType = new FormControl<any>('', [
    // Validators.required
  ])

  audioData: Voice_data

  //#-----------------------------[Change Language]--------------------------------#

  public confirmDownload = 'ยืนยันการดาวน์โหลดไฟล์เสียง';
  public cancel = 'ยกเลิก';
  public accept = 'ยืนยัน';

  //#-----------------------------[Change Language]--------------------------------#



  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<AudioDownloadDialogComponent>,
    private _auth: AuthService,
    private _audioStorageApi: AudioStorageApiService,
    // private snackbar: MatSnackBar,
  ) {
    this.audioData = data

  }

  ngOnInit(): void {

  }

  download() {
    const filename = this.audioData.text + '.' + this.audioData.type_media
    saveAs(this.audioData.url, filename)
  }

  downloadAudio(data: Blob, file_name: string, file_Type: string) {
    const a = document.createElement('a')
    const blob = new Blob([data], { type: 'audio/' + file_Type })

    const url = window.URL.createObjectURL(blob);

    a.href = url

    a.download = file_name;
    a.click();
    URL.revokeObjectURL(url);
  }

  text = TH.audioDownloadObj;

  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.audioDownloadObj;
    }
    else if (temp == 'EN') {
      this.text = EN.audioDownloadObj;
    }
    this.getdataInfo();
  }

  getdataInfo() {
    this.confirmDownload = this.text.confirmDownload;
    this.cancel = this.text.cancel;
    this.accept = this.text.accept;
  }
}
