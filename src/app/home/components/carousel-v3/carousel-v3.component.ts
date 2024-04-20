import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ComponentQueueService } from '../../services/component-queue.service';
import { TH_EN_flag } from 'src/app/voice/mocks/conversation-mock';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { MatSelect } from '@angular/material/select';
import { loopUpDown } from 'src/app/shared/animation/animation';
import { Language } from 'src/app/shared/models/shared-model';
import { TLangListAll } from 'src/app/voice/models/conversation-model';

@Component({
  selector: 'app-carousel-v3',
  templateUrl: './carousel-v3.component.html',
  styleUrls: ['./carousel-v3.component.scss'],
  animations: [loopUpDown],
})
export class CarouselV3Component implements OnInit, AfterViewInit, OnDestroy {
  @Output() loaded = new EventEmitter<boolean>();
  @Input() isLoggedin: boolean;

  @ViewChild('select') select: MatSelect;

  state = 'in';

  // Make 6 items for image looping
  items: number[] = Array.from({ length: 6 }, (_, i) => i);
  public currentLangSelect = 'th';
  public text = language['TH'].landingPageV3Obj;
  public lang = null;
  public currentFlag = null;

  public currentSpeakerList = [];
  public langList: TLangListAll[] = TH_EN_flag;
  public langCode: Language = null;
  public audio = new Audio();
  public isAudioPlay: boolean = false;

  constructor(
    private _compontentQueue: ComponentQueueService,
    private _changeLanguage: ChangeLanguageService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.langList = this.langList.slice(0, 9);
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].landingPageV3Obj;

        this.langCode = res;
        if (res === 'TH') {
          this.currentLangSelect = 'th';
        } else {
          this.currentLangSelect = 'en';
        }

        this.getFlagAndLang(this.currentLangSelect);
        this.getSpeaker(this.currentLangSelect);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.state = 'out';
    }, 0);

    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(1);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.stopAll();
  }

  onEnd(event: any) {
    this.state = 'in';
    if (event.toState === 'in') {
      setTimeout(() => {
        this.state = 'out';
      }, 0);
    }
  }

  isTablet() {
    return window.innerWidth <= 1200; // 1200px or smaller
  }

  getFlagAndLang(language: string) {
    const data = this.langList.find((item) => {
      return item.value === language;
    });

    this.lang = this.getCountryName(data);
    this.currentFlag = data.flag;
  }

  getCountryName(item: TLangListAll): string {
    return this.langCode === 'EN' ? item.EN_name : item.TH_name;
  }

  getSpeaker(language: string) {
    const speakerData = this.mock_speaker[language];

    this.currentSpeakerList = speakerData;
  }

  switchLang(event: any) {
    this.stopAll();
    this.currentLangSelect = event.value;
    this.getFlagAndLang(event.value);
    this.getSpeaker(event.value);
  }

  playSample(audioURL: string, isPlaying: boolean, name: string) {
    const speaker = this.currentSpeakerList.filter(
      (item) => item.name === name,
    );

    // this.mutateList[index].isPlaying = !this.mutateList[index].isPlaying;
    if (!this.isAudioPlay) {
      this.stopAll();
      this.audio.src = audioURL;
      this.audio.play();
      this.isAudioPlay = true;
      speaker[0].isPlaying = true;
    } else if (this.isAudioPlay && !isPlaying) {
      this.stopAll();
      this.audio.src = audioURL;
      this.audio.play();
      this.isAudioPlay = true;
      speaker[0].isPlaying = true;
    } else if (isPlaying) {
      this.stopAll();
    }

    this.audio.addEventListener('ended', () => {
      this.stopAll();
    });
  }

  stopAll() {
    this.isAudioPlay = false;
    this.audio.pause();
    for (let speaker of this.currentSpeakerList) {
      speaker.isPlaying = false;
    }
  }

  loginFirebase() {
    if (this.isLoggedin) {
      this.router.navigate(['/tts/conversation']);
    } else {
      this.dialog.open(FirebaseAuthComponent);
    }
  }

  fetchAPI() {}

  scrollToDiv() {
    const targetElement = document.getElementById('createSoundSample');

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Mock data to reduce API calling //
  mock_speaker = {
    en: [
      {
        name: 'ellie',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/ellie/square_ellie.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/ellie/sound_1_ellie.wav',
        isPlaying: false,
      },
      {
        name: 'matt',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/matt/square_matt.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/matt/sound_1_matt.wav',
        isPlaying: false,
      },
      {
        name: 'nadia',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/nadia/square_nadia.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/nadia/sound_1_nadia.wav',
        isPlaying: false,
      },
    ],
    id: [
      {
        name: 'dia',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/dia/square_dia.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/dia/sound_1_dia.wav',
        isPlaying: false,
      },
      {
        name: 'taufik',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/taufik/square_taufik.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/taufik/sound_1_taufik.wav',
        isPlaying: false,
      },
      {
        name: 'zamira',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/zamira/square_zamira.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/zamira/sound_1_zamira.wav',
        isPlaying: false,
      },
    ],
    ja: [
      {
        name: 'kanna',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/kanna/square_kanna.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/kanna/sound_1_kanna.wav',
        isPlaying: false,
      },
      {
        name: 'sae',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/sae/square_sae.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/sae/sound_1_sae.wav',
        isPlaying: false,
      },
    ],
    vi: [
      {
        name: 'dang',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/dang/square_dang.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/dang/sound_1_dang.wav',
        isPlaying: false,
      },
      {
        name: 'thanh',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/thanh/thanh.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/thanh/sound_1_thanh.wav',
        isPlaying: false,
      },
      {
        name: 'phuong',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/phuong/square_phuong.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/phuong/sound_1_phuong.wav',
        isPlaying: false,
      },
    ],
    lo: [
      {
        name: 'phorn',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/phorn/square_phorn.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/phorn/sound_1_phorn.wav',
        isPlaying: false,
      },
      {
        name: 'sorn',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/sorn/square_sorn.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/sorn/sound_1_sorn.wav',
        isPlaying: false,
      },
      {
        name: 'bunyang',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/bunyang/square_bunyang.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/bunyang/sound_1_bunyang.wav',
        isPlaying: false,
      },
    ],
    th: [
      {
        name: 'ava',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/ava/square_ava.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/ava/sound_1_ava.wav',
        isPlaying: false,
      },
      {
        name: 'alan',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/alan/square_alan.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/alan/sound_1_alan.wav',
        isPlaying: false,
      },
      {
        name: 'siren',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/siren/square_siren.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/siren/sound_1_siren.wav',
        isPlaying: false,
      },
    ],
    my: [
      {
        name: 'yati',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/yati/square_yati.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/yati/sound_1_yati.wav',
        isPlaying: false,
      },
      {
        name: 'heyma',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/heyma/square_heyma.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/heyma/sound_1_heyma.wav',
        isPlaying: false,
      },
      {
        name: 'cetan',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/cetan/square_cetan.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/cetan/sound_1_cetan.wav',
        isPlaying: false,
      },
    ],
    zh: [
      {
        name: 'juan',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/juan/square_juan.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/juan/sound_1_juan.wav',
        isPlaying: false,
      },
      {
        name: 'jie',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/jie/square_jie.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/jie/sound_1_jie.wav',
        isPlaying: false,
      },
      {
        name: 'xin',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/xin/square_xin.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/xin/sound_1_xin.wav',
        isPlaying: false,
      },
    ],
    km: [
      {
        name: 'thanaw',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/thanaw/square_thanaw.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/thanaw/sound_1_thanaw.wav',
        isPlaying: false,
      },
      {
        name: 'mala',
        img: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/mala/square_mala.webp',
        url: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/picture/mala/sound_1_mala.wav',
        isPlaying: false,
      },
    ],
  };
}
