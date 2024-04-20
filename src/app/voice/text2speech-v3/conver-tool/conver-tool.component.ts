import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SpeakerService } from 'src/app/shared/services/speaker.service';

@Component({
  selector: 'app-conver-tool',
  templateUrl: './conver-tool.component.html',
  styleUrls: ['./conver-tool.component.scss'],
})
export class ConverToolComponent implements OnInit {
  @Output() _volumeEvent = new EventEmitter<string>();
  @Output() _speedEvent = new EventEmitter<string>();
  @Output() _selectedSpeaker = new EventEmitter<string>();
  @Output() _speakerImg = new EventEmitter<string>();
  @Output() _langEvent = new EventEmitter<string>();
  @ViewChild('volumeBar') set volumeBar(element: any) {
    if (element) {
      setTimeout(() => {
        const progress = (+this.volumeValue / +element.nativeElement.max) * 100;
        element.nativeElement.style.background = `linear-gradient(to right, #323130 ${progress}%, #f7f8fa ${progress}%)`;
      }, 0);
    }
  }

  public isVolumeShow: boolean = false;
  public isSpeedShow: boolean = false;
  public isDelayShow: boolean = false;
  public isLangShow: boolean = false;
  public isSpeakerShow: boolean = false;
  public isSpeakerListShow: boolean = false;
  public isSpeedSelected: any = 3;
  public selectedLang: any = 0;
  public volumeValue: string = '0.5';
  public volumeShow: any = +this.volumeValue * 100;
  public speakerCart: any = [];
  public currentSpeaker: { face_img: any; id: any } = {
    face_img:
      'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/ava/face_ava.webp',
    id: '1',
  };

  ////////////////////////////////////////////////////////////

  speedItems: { name: string; value: string }[] = [
    { name: '0.25', value: '0.25' },
    { name: '0.5', value: '0.50' },
    { name: '0.75', value: '0.75' },
    { name: 'ปกติ', value: '1' },
    { name: '1.25', value: '1.25' },
    { name: '1.5', value: '1.5' },
    { name: '1.75', value: '1.75' },
  ];
  public speedShow: any = this.speedItems[3].name;

  delayItems: { name: string; value: string }[] = [
    { name: '0.1 วิ', value: '0.1' },
    { name: '0.2 วิ', value: '0.2' },
    { name: '0.3 วิ', value: '0.3' },
    { name: '0.4 วิ', value: '0.4' },
    { name: '0.5 วิ', value: '0.5' },
  ];

  langItems: { name: string; value: string }[] = [
    { name: 'ไทย', value: 'th' },
    { name: 'อังกฤษ', value: 'en' },
    { name: 'ลาว', value: 'lo' },
    { name: 'พม่า', value: 'my' },
    { name: 'เวียดนาม', value: 'vi' },
    { name: 'อินโดนีเซีย', value: 'id' },
    { name: 'ญี่ปุ่น', value: 'ja' },
    { name: 'จีน', value: 'zh' },
  ];
  public langShow: any = this.langItems[0].name;

  constructor(private http: HttpClient, private _speaker: SpeakerService) { }

  ngOnInit() {
    this._speaker.getSpeaker();

    sessionStorage.setItem('default_speaker', '1');
    if (!this.speakerCart.length) {
      const defaultSpeaker = sessionStorage.getItem('default_speaker');
      const speakers = JSON.parse(sessionStorage.getItem('speaker') || '[]');

      const result = speakers.filter(
        (speaker: any) => speaker.speaker_id === defaultSpeaker
      );

      this.currentSpeaker = {
        face_img: result[0].face_image,
        id: result[0].speaker_id,
      };

      console.log(this.currentSpeaker);
    }

    // this.currentSpeaker = {
    //   face_img: this.speakerCart[0].face_image,
    //   id: this.speakerCart[0].speaker_id,
    // };
  }

  ngOnChanges() { }

  toggleSpeaker() {
    this.isSpeakerShow = !this.isSpeakerShow;
    this.speakerCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.isSpeedShow = false;
    this.isDelayShow = false;
    this.isLangShow = false;
  }

  toggleVolume() {
    this.isVolumeShow = !this.isVolumeShow;
    this.isSpeedShow = false;
    this.isDelayShow = false;
    this.isLangShow = false;
    this.isSpeakerShow = false;
  }

  toggleSpeed() {
    this.isSpeedShow = !this.isSpeedShow;
    this.isDelayShow = false;
    this.isVolumeShow = false;
    this.isLangShow = false;
    this.isSpeakerShow = false;
  }

  toggleDelay() {
    this.isDelayShow = !this.isDelayShow;
    this.isSpeedShow = false;
    this.isVolumeShow = false;
    this.isLangShow = false;
    this.isSpeakerShow = false;
  }

  toggleLang() {
    this.isLangShow = !this.isLangShow;
    this.isDelayShow = false;
    this.isSpeedShow = false;
    this.isVolumeShow = false;
    this.isSpeakerShow = false;
  }

  // clickOutsideClose() {
  //   this.isSpeakerListShow = false;
  // }

  speakerClose() {
    this.isSpeakerShow = false;
    // this.isSpeakerListShow = false;
  }

  speakerListClose() {
    // this.isSpeakerShow = false;
    this.isSpeakerListShow = false;
  }

  langClose() {
    this.isLangShow = false;
  }

  volumeClose() {
    this.isVolumeShow = false;
  }

  speedClose() {
    this.isSpeedShow = false;
  }

  delayClose() {
    this.isDelayShow = false;
  }

  getSpeaker() {
    this.isSpeakerListShow = !this.isSpeakerListShow;
  }

  changeVolume($event: any) {
    const sliderEle = document.getElementById('volumeBar') as HTMLInputElement;
    let currentValue = $event.target.value;
    this.volumeValue = currentValue;
    this.volumeShow = Math.floor(+this.volumeValue * 100);
    const progress = (+this.volumeValue / +sliderEle.max) * 100;
    sliderEle.style.background = `linear-gradient(to right, #323130 ${progress}%, #f7f8fa ${progress}%)`;
    // console.log(this.volumeValue);
    this._volumeEvent.emit(this.volumeValue);
  }

  closeVolumePopup() {
    this.isVolumeShow = false;
  }

  selectedSpeed(value: any, i: any) {
    this.isSpeedSelected = i;
    this.speedShow = this.speedItems[i].name;
    this._speedEvent.emit(value);
    this.isSpeedShow = false;
  }

  selectSpeaker(img: any, id: any) {
    this.currentSpeaker.face_img = img;
    this.currentSpeaker.id = id;
    this._selectedSpeaker.emit(id);
    this._speakerImg.emit(img);
    this.isSpeakerShow = false;
  }

  selectLang(value: any, i: any) {
    this.selectedLang = i;
    this.langShow = this.langItems[i].name;
    this._langEvent.emit(value);
    this.isLangShow = false;
  }
}
