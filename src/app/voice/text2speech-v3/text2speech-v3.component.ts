import { Component, OnInit } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { generateID } from '../text2speech-v2/function/random';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-text2speech-v3',
  templateUrl: './text2speech-v3.component.html',
  styleUrls: ['./text2speech-v3.component.scss'],
})
export class Text2speechV3Component implements OnInit {
  //////////////CONVER BAR/////////////////
  public value = '';
  public volumeValue: any;
  public textQuota: any;
  public isCreateVoice: boolean = true;
  public isShowText: boolean = false;
  public placeholder = 'พิมพ์ข้อความ';
  public speaker_face: string =
    'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/ava/face_ava.webp';
  /////////////////////////////////////////
  public pinTexts: {
    audio_id: string;
    text: string;
    text_delay: string;
    speaker: string;
    volume: string;
    speed: string;
    type_voice: string;
    audio_url: string;
    isPlaying: boolean;
    face_img: string;
    isShowDownload: boolean;
    isLoading: boolean;
  }[] = [];
  ////////////////Audio/////////////////////
  public file = new Audio();
  public showDownloadPopup?: number;
  //////////////////////////////////////////

  data = {
    audio_id: 'ASCVS',
    language: 'th',
    text: '',
    text_delay: '',
    speaker: '1',
    volume: '0.5',
    speed: '1',
    type_voice: 'wav',
  };

  constructor(
    private _tts: TextspeechService,
    private workspace: WorkspaceService,
  ) {}

  ngOnInit(): void {
    this.textQuota = this.value.length;
  }

  onBoxResize(e: any) {
    // console.log(e);
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 0 + 'px';
    console.log(this.workspace.textData);
  }

  onQuota(value: any) {
    // console.log(value);
    this.textQuota = value.length;
  }

  getSound(value: string) {
    this.data.audio_id = generateID();
    this.data.text = value;
    this.data.text_delay = value;
    //////////
    this.pinTexts.push({
      audio_id: this.data.audio_id,
      text: this.data.text,
      audio_url: '',
      text_delay: this.data.text,
      speaker: this.data.speaker,
      volume: this.data.volume,
      speed: this.data.speed,
      face_img: this.speaker_face,
      type_voice: 'wav',
      isPlaying: false,
      isShowDownload: false,
      isLoading: true,
    });
    this._tts.generateVoice(this.data).subscribe(
      (resp: any) => {
        // console.log(resp);
        const src = URL.createObjectURL(resp);
        this.pinTexts.map((speaker: any) => {
          if (speaker.audio_id === this.data.audio_id) {
            speaker.audio_url = src;
          }
        });
        console.log(this.pinTexts);
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.pinTexts.map((speaker: any) => {
          if (speaker.audio_id === this.data.audio_id) {
            speaker.isLoading = false;
          }
        });
      },
    );
    ///// clear value /////
    this.value = '';
  }

  ////////////Audio controls////////////

  onChangeSeek(i: any) {
    const timeline = document.getElementById(
      `timeline_${i}`,
    ) as HTMLInputElement;

    const time = (+timeline.value * this.file.duration) / 100;
    this.file.currentTime = time;
  }

  // toggleText(i: any) {
  //   let text = document.getElementById(`text_${i}`) as HTMLInputElement;
  //   if (text.style.display === 'none') {
  //     text.style.display = 'flex';
  //   } else {
  //     text.style.display = 'none';
  //   }
  //   // console.log(text);
  // }

  toggleAudio(i: any) {
    const timeline = document.getElementById(
      `timeline_${i}`,
    ) as HTMLInputElement;

    const changeTimelinePosition = () => {
      const percentPosition =
        (100 * this.file.currentTime) / this.file.duration;
      timeline.style.backgroundSize = `${percentPosition}% 100%`;
      timeline.value = percentPosition.toString();
    };

    this.file.ontimeupdate = changeTimelinePosition;

    this.file.pause();

    if (this.pinTexts[i].isPlaying) {
      this.pinTexts[i].isPlaying = false;
    } else if (
      this.file.currentTime > 0 &&
      this.pinTexts[i].isPlaying === false
    ) {
      this.pinTexts[i].isPlaying = true;
      this.file.play();
    } else {
      this.pinTexts[i].isPlaying = true;
      this.file.src = this.pinTexts[i].audio_url;
      this.file.volume = +this.pinTexts[i].volume;
      this.file.playbackRate = +this.pinTexts[i].speed;
      this.file.currentTime = 0;
      this.file.play();
    }

    this.file.onplay;

    this.file.addEventListener('ended', () => {
      this.file.currentTime = 0;
      this.pinTexts[i].isPlaying = false;
    });
  }

  //////////////////////////////////////

  toggleDownload(i: any) {
    this.pinTexts[i].isShowDownload = !this.pinTexts[i].isShowDownload;
  }

  downloadAudio(i: any, type: any) {
    this.pinTexts[i].isShowDownload = false;

    const temp = {
      audio_id: this.pinTexts[i].audio_id,
      text: this.pinTexts[i].text,
      text_delay: '',
      speaker: this.data.speaker,
      volume: +this.data.volume * 100,
      speed: '1',
      type_voice: type,
    };

    const file = 'BNV_' + temp.text.substring(0, 20);

    this._tts.downloadVoice(temp).subscribe((res) => {
      console.log(res);
      saveAs(res, file);
    });
  }

  deleteAudio(i: any) {
    this.pinTexts.splice(i, 1);
  }

  editAudio(text: string, index: any) {
    this.value = text;
  }

  ///////////conver Controls///////////////
  onChangeVolume(volumeData: string) {
    this.data.volume = volumeData;
  }

  onChangeSpeed(speedData: string) {
    // console.log(speedData);
    this.data.speed = speedData;
  }

  onSelectSpeaker(speakerId: string) {
    // console.log(speakerId);
    this.data.speaker = speakerId;
  }

  onSpeakerImg(speakerImg: string) {
    this.speaker_face = speakerImg;
  }

  onChangeLang(langData: string) {
    this.data.language = langData;
  }
  //////////////////////////////////////////

  createNewVoice() {
    this.isCreateVoice = true;
  }

  drop(event: any) {
    moveItemInArray(this.pinTexts, event.previousIndex, event.currentIndex);
  }
}
