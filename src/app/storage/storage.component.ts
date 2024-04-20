import { Clipboard } from '@angular/cdk/clipboard';
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Track } from 'ngx-audio-player';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EN } from '../shared/change_language/EN';
import { TH } from '../shared/change_language/TH';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { SpeakerService } from '../shared/services/speaker.service';
import { AudioDownloadDialogComponent } from './components/audio-download-dialog/audio-download-dialog.component';
import { AudioDownloadSelectComponent } from './components/audio-download-select/audio-download-select.component';
import { AudioRemoveSelectComponent } from './components/audio-remove-select/audio-remove-select.component';
import { AudioStorageApiService } from './services/audio-storage-api.service';
import { Voice_data } from '../shared/models/shared-model';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  public task = {
    'color': 'primary'
  }
  @ViewChild('progressBar') progressBar: MatProgressBar;
  public changeText = false
  audio = new Audio()
  page = 1
  maxPage = 0
  audioData: Array<Voice_data> = []
  public Choose = -1;
  public nowfulltextIndex = -1;
  public floatingMessage = [];
  public messageShow = false;
  public sizeBox = 45;
  currentSize = ''
  storageMax: string // bytes = 1 GB
  remainingStorage = 0
  minutes = '00'
  seconds = '00'
  hours = '00'
  speaker = []
  audioSearch = new FormControl<any>('')
  audioFile = new FormControl<any>('')
  isApiFiring = false
  //var for mouse activity to change images
  audio_logo = '/music_logo.svg'
  public arrayOfCheck = [];

  max_quota = 104857600 // 100mb

  //audio player
  msaapAutoPlay = true;
  // msaapPlaylist: Track[] = [];
  //audio logo
  audioLogoHtml: HTMLButtonElement
  hoverOnAudioImage = false
  hoverLogoHtml: HTMLButtonElement
  isAudioPlay = false

  public showDelay = new FormControl<any>(400);
  public position = new FormControl<any>('above');
  public tooltips = []
  public options = ["ดาวน์โหลดเสียงที่เลือก", "ลบไฟล์เสียงที่เลือก"]


  //#-----------------------------[Change Language]--------------------------------#

  public studio = "คลังเสียงของฉัน";
  public storageText = "พื้นที่เก็บข้อมูล";
  public usede = "ใช้ไปแล้ว";
  public from = "จาก";
  public allsoundFile = "ไฟล์เสียงทั้งหมด";
  public searchSound = "ค้นหาไฟล์เสียง";
  public page_ = "หน้า";
  public text_ = "ดูข้อความ";
  public upload = "อัพโหลด";
  public seletedPage = "เลือกทั้งหมด (หน้า";
  public deleteSelected = "ล้างตัวเลือก";
  public downloadSoundfile = "ดาวน์โหลดไฟล์เสียง";
  public download_ = "ดาวน์โหลด";
  public deleteSoundfile = "ลบไฟล์เสียง";
  public delete_ = "ลบทิ้ง";
  public downloading = "กำลังอัพโหลดไฟล์";
  public sucessfulDownload = "อัพโหลดไฟล์สำเร็จ";
  public copycomplete = "คัดลอกลิงค์เรียบร้อย";
  public copytoclipboard = "คัดลอกข้อความไปยังคลิปบอร์ดเรียบร้อย";
  public successfulDownloadsound = "ดาวน์โหลดเสียงเรียบร้อย";
  public successfulDeletesound = "ลบไฟล์เสียงเรียบร้อย";
  public successdeleteSoundfile = "ลบไฟล์เสียงเรียบร้อย";
  public successdeleteAllsoundfile = "ลบไฟล์เสียงทั้งหมดเรียบร้อย";


  //#-----------------------------[Change Language]--------------------------------#


  constructor(
    private dialog: MatDialog,
    private _audioStorageApi: AudioStorageApiService,
    private snackbar: MatSnackBar,
    private _speaker: SpeakerService,
    private clipboard: Clipboard,
    private _changelanguage: ChangeLanguageService
  ) {
    this.speaker = _speaker.getSpeaker()

  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        console.log(res);

        this.get_dataChangelanguage(res);
      }
    })
    this.callMultiFunctions()

    this.audio.onended = ended => {
      this.isAudioPlay = false
    }
  }

  callMultiFunctions() {
    this.getAllStorage()
    // this.checkSize()
  }

  onEnded(event: string) {
    if (event == 'ended') {
      this.isAudioPlay = false
    }
  }

  clickImageToPlayAudio(audio_image: HTMLButtonElement, audioData: Voice_data) {
    if (this.isAudioPlay && audio_image == this.audioLogoHtml) {
      this.isAudioPlay = false
      return this.audio.pause()
    }

    this.audioLogoHtml = audio_image
    this.isAudioPlay = true

    this.audio.src = audioData.url
    this.audio.play()

    // this.msaapPlaylist = [{
    //   title: audioData.text+'.'+audioData.type_media,
    //   link: audioData.url
    // }]

    // this.msaapAutoPlay = true
  }

  checkCheckBoxvalue(event: any) {
    if (event.source.checked && !this.arrayOfCheck.includes(event.source.value.audio_id)) {   //checked
      this.arrayOfCheck.push(event.source.value.audio_id);
    }
    else {
      //unchecked
      this.arrayOfCheck.splice(this.arrayOfCheck.indexOf(event.source.value.audio_id), 1);
    }
  }

  checkAll() {
    this.clearAll()
    const arr = this._audioStorageApi.searchData.getValue()
    arr.forEach(e => {
      if (!this.arrayOfCheck.includes(e)) {
        this.arrayOfCheck.push(e.audio_id);
        e.selected = true;
      }
    })
  }

  clearAll() {
    this.arrayOfCheck = []
    for (let i in this.audioData) {
      this.audioData[i].selected = false;
    }
  }

  changeAudioStateImage() {
    const res = {
      'background-image': "url('../../assets/audio_storage/" + (this.isAudioPlay ? 'music_pause.svg' : 'music_play.svg') + "')",
      'background-size': "contain",
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'width': '100%',
      'height': '100%'
    }

    return res
  }


  hoverChangeImage(audio_image: HTMLButtonElement, status: boolean) {

    this.hoverOnAudioImage = status
    this.hoverLogoHtml = audio_image ? audio_image : null

  }

  onFileChange(event) {
    const files = event.target.files;

    if (files.length === 0) return;

    const mimeType = files[0].type;

    if (mimeType.match(/audio\/*/) == null) return;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = e => {
      this.isApiFiring = true
      const snackbarUpload = this.snackbar.open((this.downloading + '...'), '', {
        panelClass: ['snackbar-success']
      })
      this._audioStorageApi.uploadFile(files[0].name.replace(/\.[^/.]+$/, ""), reader.result)
        .pipe(catchError((err) => {
          snackbarUpload.dismiss()
          return throwError(err)
        })
        )
        .subscribe(
          res => {
            snackbarUpload.dismiss()
            if (res) {
              this.snackbar.open(this.sucessfulDownload, '', {
                duration: 3000,
                panelClass: ['snackbar-success']
              })
              this.callMultiFunctions()
            }
          }
        );
    }
  }

  checkSize() {
    this._audioStorageApi.checkSize().subscribe(
      res => {
        this.styleSize(res)
        // if (res) {
        //   const max_quota: number = _isNumberValue(res.max_quota) ? res.max_quota : 0
        //   const current_size: number = _isNumberValue(res.current_size) ? res.current_size : 0
        //   this.storageMax = this.formatBytes(max_quota)
        //   this.currentSize = this.formatBytes(current_size)
        //   this.remainingStorage = Number(((current_size / max_quota) * 100).toFixed(3))
        //   this.progressBar.color = 'primary'
        // } else {
        //   this.storageMax = this.formatBytes(104857600)
        //   this.currentSize = this.formatBytes(104857600)
        //   this.remainingStorage = 100
        //   this.progressBar.color = 'warn'
        // }

      }
    )
  }

  styleSize(res: any) {
    /* Only status 200 can pass */
    if (res) {
      const current_size: number = _isNumberValue(res.data.size) ? res.data.size : 0
      /* Full storage when current size more than max quota */
      if (current_size >= this.max_quota) {
        this.storageMax = this.formatBytes(104857600)
        this.currentSize = this.formatBytes(104857600)
        this.remainingStorage = 100
        this.progressBar.color = 'warn'
      } else {
        this.storageMax = this.formatBytes(this.max_quota)
        this.currentSize = this.formatBytes(current_size)
        this.remainingStorage = Number(((current_size / this.max_quota) * 100).toFixed(3))
        this.progressBar.color = 'primary'
      }
    }
  }

  allocatedTime(time) {

    this.minutes = String(Math.floor((time % 3600) / 60))

    this.seconds = String(Math.floor(time - Number(this.minutes) * 60))
    this.hours = String(Math.floor((time) / 3600))

    return this.timeFormatChange()
  }

  timeFormatChange() {
    const hours = this.hours.length <= 1 ? '0' + this.hours : this.hours
    const minutes = this.minutes.length <= 1 ? '0' + this.minutes : this.minutes
    const seconds = this.seconds.length <= 1 ? '0' + this.seconds : this.seconds
    const timeFormat = hours + ':' + minutes + ':' + seconds
    return timeFormat
  }

  getAllStorage() {
    this._audioStorageApi.getAllStorage().subscribe(
      res => {
        if (res.status) {
          //get audio data
          this.audioData = this.changeAudioData(res.data.storage)

          //get max page
          this.maxPage = Math.ceil(this.audioData.length / 10)

          this.styleSize(res)
        }
      }
    )
  }

  changeAudioData(audioData: Array<Voice_data>) {
    audioData.forEach((e, i) => {
      audioData[i].speaker = this.changeSpeakerName(e.speaker)
      audioData[i].duration = this.allocatedTime(e.duration)
      audioData[i].size = this.formatBytes(e.size)
      audioData[i].datetime = this.changeYearFormat(e.datetime)
      audioData[i].selected = false

      //push data to playlist
      // this.msaapPlaylist.push({
      //   title: audioData[i].text,
      //   link: audioData[i].url
      // })
    });
    return audioData.reverse()

  }

  changeYearFormat(datetime: string) {
    const date = new Date(datetime)
    date.setFullYear(date.getFullYear() + 543)
    return String(date)
  }

  changeSpeakerName(speakerName: string) {
    const speakerMatched = this.speaker.find(e => e.thai_name == speakerName)
    return speakerMatched ? speakerMatched.thai_name : 'Upload'
  }

  toolControl(functionName: string, audioData: Voice_data) {
    if (functionName == 'copy_link') {
      this.clipboard.copy(audioData.url)
      this.snackbar.open('คัดลอกลิ้งค์แล้ว', '', {
        panelClass: ["snackbar-success"],

      })
      // this.displayFloating(this.copycomplete)
    } else {
      this[functionName](audioData) //call functions
    }
  }

  copy_text(audioData: Voice_data) {
    this.clipboard.copy(audioData.text);
    // this.displayFloating("this.copytoclipboard")
    this.snackbar.open('คัดลอกข้อความแล้ว', '', {
      panelClass: ["snackbar-success"]
    })
  }

  download(audioData: Voice_data) {
    const dialogRef = this.dialog.open(AudioDownloadDialogComponent, {

      height: 'min(50vh, 309px)',
      width: '554px',
      data: audioData
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res && res) {
        this.displayFloating("this.successfulDownloadsound")
      }
    });
  }

  trash(audioData: Voice_data) {
    const dialogRef = this.dialog.open(AudioRemoveSelectComponent, {
      height: 'min(50vh, 395px)',
      width: '554px',
      data: [audioData.url]
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      else if (res) {
        this.displayFloating(this.successfulDeletesound)
        return this.callMultiFunctions()
      }
    });
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  nextPage() {
    this.closefulltext();
    this.page < this.maxPage ? this.page += 1 : ''
  }

  previousPage() {
    this.closefulltext();
    this.page > 1 ? this.page -= 1 : ''
  }

  openfulltext(index: number) {
    this.nowfulltextIndex = index;
  }

  closefulltext() {
    this.nowfulltextIndex = -1;
  }

  copyfulltext(text: string) {
    this.clipboard.copy(text)
    this.displayFloating(this.copytoclipboard)
  }

  async displayFloating(message: string) {
    this.floatingMessage.push(message);
    this.messageShow = true;
    setTimeout(() => {
      this.floatingMessage.splice(0, 1);
      if (this.floatingMessage.length <= 0) this.messageShow = false;
    }, 4000);
  }

  onDownload() {
    let downloadselectList = [];
    for (let s of this.arrayOfCheck) {
      if (this.audioData.some(a => (s == a.audio_id))) {
        downloadselectList.push(this.audioData.find(a => (s == a.audio_id)))
      }
    }

    const progress_dialog = this.dialog.open(AudioDownloadSelectComponent, {
      panelClass: "dialog-size500",
      disableClose: true,
      backdropClass: "progress-download-backdrop",
      data: {
        queue_download: downloadselectList,
      }
    })
    progress_dialog.afterClosed().subscribe();
  }

  onRemove() {
    let delselectList = [];
    for (let s of this.arrayOfCheck) {
      if (this.audioData.some(a => (s == a.audio_id))) {
        delselectList.push(this.audioData.find(a => (s == a.audio_id)).url)
      }
    }
    const dialogRef = this.dialog.open(AudioRemoveSelectComponent, {
      height: 'min(50vh, 395px)',
      width: '554px',
      data: delselectList
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      else if (res) {
        this.displayFloating(this.successdeleteSoundfile)
        return this.callMultiFunctions()
      }
    });
  }

  onRemoveAll() {
    let url_array = []
    this.audioData.forEach(e => {
      url_array.push(e.url)
    });

    const dialogRef = this.dialog.open(AudioRemoveSelectComponent, {
      height: 'min(50vh, 395px)',
      width: '554px',
      data: url_array
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return
      else if (res) {
        this.displayFloating(this.successdeleteAllsoundfile)
        return this.callMultiFunctions()
      }
    });

  }


  text = TH.storageObj;

  get_dataChangelanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.storageObj;
    }
    else if (temp == 'EN') {
      this.text = EN.storageObj;
    }
    this.getdataInfo()
  }

  getdataInfo() {
    this.studio = this.text.studio;
    this.storageText = this.text.storageText;
    this.usede = this.text.usede;
    this.from = this.text.from;
    this.allsoundFile = this.text.allsoundFile;
    this.searchSound = this.text.searchSound;
    this.page_ = this.text.page_;
    this.text_ = this.text.text_;
    this.upload = this.text.upload;
    this.seletedPage = this.text.seletedPage;
    this.deleteSelected = this.text.deleteSelected;
    this.downloadSoundfile = this.text.downloadSoundfile;
    this.download_ = this.text.download_;
    this.deleteSoundfile = this.text.deleteSoundfile;
    this.delete_ = this.text.delete_;

    this.downloading = this.text.downloading;
    this.sucessfulDownload = this.text.sucessfulDownload;
    this.copycomplete = this.text.copycomplete;
    this.copytoclipboard = this.text.copytoclipboard;
    this.successfulDownloadsound = this.text.successfulDownloadsound;
    this.successfulDeletesound = this.text.successfulDeletesound;
    this.successdeleteSoundfile = this.text.successdeleteSoundfile;
    this.successdeleteAllsoundfile = this.text.successdeleteAllsoundfile;
    this.tooltips = this.text.tooltip
  }

}
