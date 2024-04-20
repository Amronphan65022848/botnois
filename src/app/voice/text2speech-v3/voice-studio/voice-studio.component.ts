import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-voice-studio',
  templateUrl: './voice-studio.component.html',
  styleUrls: ['./voice-studio.component.scss'],
})
export class VoiceStudioComponent {
  @Input() audioList: {
    audio_id: string;
    text: string;
    text_delay: string;
    speaker: string;
    volume: string;
    speed: string;
    type_voice: string;
    audio_url: string;
    face_img: string;
  }[] = [];

  ///////////////////////////////////////
  public audio = new Audio();
  public totalTime: number = 0;
  public isPlaying: boolean = false;
  ///////////////////////////////////////

  constructor(private http: HttpClient, private _tts: TextspeechService) {}

  downloadAll() {
    // this._downloadAllEvent.emit();
    const audioArr: {}[] = [];
    if (this.audioList?.length) {
      this.audioList.forEach((item) => {
        audioArr.push({
          text: String(item.text),
          text_delay: String(item.text_delay),
          volume: String((+item.volume * 100).toString()),
          speaker: String(item.speaker),
          speed: String(item.speed),
          type_voice: 'wav',
          audio_id: item.audio_id,
        });
      });
    }
    const body = {
      audio_list: audioArr,
      save_file: false,
    };

    console.log(body);

    ///////////////////////////////////////

    this._tts.downloadAll(body).subscribe((resp) => {
      console.log(resp);
      // if (resp instanceof Blob) {
      // }
      const file = 'BNV_' + new Date().getTime() + '.zip';

      saveAs(resp, file);
    });
  }

  ///NEED TO FIX/// : IN PROGRESS...
  async playAll() {
    // this.audio.pause();

    // if (this.isPlaying === true) {
    //   this.isPlaying = false;
    // } else if (this.isPlaying === false && this.audio.currentTime > 0) {
    //   this.audio.play();
    //   this.isPlaying = true;
    // } else {
    //   this.isPlaying = true;
    let i = 0;
    let totalDuration = 0;
    let lastCurrentTime: number = 0;

    const timeline = document.getElementById(
      `timeline-all`
    ) as HTMLInputElement;

    const changeTimelinePosition = () => {
      if (i < 1) {
        const percentPosition = (100 * this.audio.currentTime) / this.totalTime;
        timeline.style.backgroundSize = `${percentPosition}% 100%`;
        timeline.value = percentPosition.toString();
      } else {
        const percentPosition =
          (100 * (this.audio.currentTime + lastCurrentTime)) / this.totalTime;
        timeline.style.backgroundSize = `${percentPosition}% 100%`;
        timeline.value = percentPosition.toString();
      }
    };
    this.audio.ontimeupdate = changeTimelinePosition;

    let audio_src: any = [];
    this.audioList.forEach((audio) => audio_src.push(audio.audio_url));

    let loadedSounds = [];

    const findTotalTime = await audio_src.map((src: any) => {
      this.audio.src = src;
      this.audio.load();
      this.audio.addEventListener('loadedmetadata', () => {
        if (i < 1) {
          totalDuration += this.audio.duration;
          loadedSounds.push(this.audio);
          if (loadedSounds.length === audio_src.length) {
            console.log(totalDuration);
            this.totalTime = totalDuration;
          }
        }
      });
    });

    this.audio.src = audio_src[i];
    this.audio.play();
    this.audio.addEventListener('ended', () => {
      i++;
      lastCurrentTime += this.audio.currentTime;
      this.audio.ontimeupdate = changeTimelinePosition;
      if (i < audio_src.length) {
        this.audio.src = audio_src[i];
        this.audio.play();
        console.log;
      }
    });
    // }
  }
}
