import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { TH_EN_flag } from 'src/app/voice/mocks/conversation-mock';
import { speakerDataMock } from 'src/app/marketplace/data/data';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { AdsService } from 'src/app/voice/services/ads.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DialogAdsComponent } from 'src/app/dialog/components/dialog-ads/dialog-ads.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Language } from 'src/app/shared/models/shared-model';
import { TLangListAll } from 'src/app/voice/models/conversation-model';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-create-sound',
  templateUrl: './create-sound.component.html',
  styleUrls: ['./create-sound.component.scss'],
})
export class CreateSoundComponent {
  public currentLangSelect = 'th';
  public text = null;
  public textLang: Language = null;
  public lang = null;
  public currentFlag = null;

  isSmallScreen: boolean = false;
  isMobile: boolean = false;
  isDownloadButtonEnabled: boolean = false;

  textAreaValue: string = '';
  selectedSpeaker: string = '';
  tabIndex: number = 0;
  maxLengthEN: number = 10;
  maxLengthTH: number = 5;

  popup1 = false;
  popup2 = false;
  popup3 = false;

  public speakerList = [];
  public langList = TH_EN_flag;
  public tabs = [];

  public audio = new Audio();
  public isAudioPlay: boolean = false;
  isLoading = false;
  public oldData = {
    text: '',
    speaker: '',
    url: '',
  };

  public adsCount: number = 0;
  public maxCount: number = 0;

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _gfunc: GlobalFunctionService,
    private elementRef: ElementRef,
    private _tts: TextspeechService,
    private _dialog: DialogService,
    private _ads: AdsService,
    private _notification: NotificationService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private router: Router,
    public _auth: AuthService,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 640) {
      this.isSmallScreen = true;
    } else if (event.target.innerWidth >= 640) {
      this.isSmallScreen = false;
    }

    if (event.target.innerWidth < 420) {
      this.isMobile = true;
    } else if (event.target.innerWidth >= 420) {
      this.isMobile = false;
    }

    this.calculateMaxLength(event.target.innerWidth);
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('landing_count')) {
      sessionStorage.setItem('landing_count', '0');
    } else {
      this.adsCount = +JSON.parse(sessionStorage.getItem('landing_count'));
    }

    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.textLang = res;
        this.text = language[res].landingPageV3Obj;

        this.tabs = language[res].landingPageV3Obj.createSound.tabs;

        if (res === 'TH') {
          this.currentLangSelect = 'th';
          this.speakerList = this.filterSpeaker('th');
          this.selectedSpeaker = '1';
        } else {
          this.currentLangSelect = 'en';
          this.speakerList = this.filterSpeaker('en');
          this.selectedSpeaker = '40';
        }

        this.getFlagAndLang(this.currentLangSelect);
      }
    });

    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      this.isSmallScreen = true;
    }

    if (screenWidth < 420) {
      this.isMobile = true;
    }
  }

  login() {
    if (this._auth.getToken()?.length) {
      this.router.navigate(['tts/conversation']);
      return;
    } else {
      this.dialog.open(FirebaseAuthComponent, {
        // maxHeight: '60%',
        // height: '500px'
      });
    }
  }

  private calculateMaxLength(width: number): void {
    if (width <= 320) {
      this.maxLengthTH = 5;
      this.maxLengthEN = 5;
    } else if (width <= 490) {
      this.maxLengthTH = 7;
      this.maxLengthEN = 5;
    } else if (width <= 670) {
      this.maxLengthTH = 8;
      this.maxLengthEN = 5;
    } else if (width <= 744) {
      this.maxLengthTH = 9;
      this.maxLengthEN = 5;
    } else {
      this.maxLengthTH = 10;
      this.maxLengthEN = 20;
    }
  }

  truncateText(text: string): string {
    const maxLength =
      this.currentLangSelect === 'TH' ? this.maxLengthTH : this.maxLengthEN;
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  getFlagAndLang(language: string) {
    const data = this.langList.find((item) => {
      return item.value === language;
    });

    this.lang = this.getCountryName(data);
    this.currentFlag = data.flag;
  }

  getCountryName(item: TLangListAll): string {
    return this.textLang === 'EN' ? item.EN_name : item.TH_name;
  }

  switchLang(event: any) {
    this.stopAll();
    this.speakerList = this.filterSpeaker(event.value);
    this.onSelectSpeaker(this.speakerList[0].speaker_id);
    this.getFlagAndLang(event.value);
  }

  switchTab(i: number) {
    this.tabIndex = i;
  }

  switchTabByArrow(action: string) {
    if (action === 'increase') {
      this.tabIndex = this.tabIndex + 1;
    } else {
      this.tabIndex = this.tabIndex - 1;
    }
  }

  filterSpeaker(lang: string) {
    const speakers = speakerDataMock
      .filter((speaker) => {
        return speaker.language.toLowerCase() === lang;
      })
      .slice(0, 2);

    return speakers;
  }

  updateInputHeight() {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    this._gfunc.autogrow(textarea, '36px');
  }

  onSelectSpeaker(id: string) {
    this.selectedSpeaker = id;
  }

  updateAdsCount() {
    this.adsCount++;
    sessionStorage.setItem('landing_count', String(this.adsCount));
  }

  resetAdsCount() {
    this.adsCount = 0;
    sessionStorage.setItem('landing_count', '0');
  }

  async checkAds() {
    if (this.isAudioPlay) {
      this.stopAll();
      return;
    }

    this.isLoading = true;
    this.maxCount = this._notification.notifyJson.getValue().ads.landing_max;
    if (!this.maxCount) {
      this.maxCount = 5;
    }
    sessionStorage.setItem('landing_max', String(this.maxCount));
    try {
      if (this.adsCount < this.maxCount) {
        const url = await this.generateSound();
        this.playSample(url);
        this.updateAdsCount();
      } else {
        const url = await this.generateSound();
        const ads = await this._ads.getSingleAdsNoToken();
        this.dialog
          .open(DialogAdsComponent, {
            disableClose: true,
            data: ads,
          })
          .afterClosed()
          .subscribe((bool: boolean) => {
            if (!bool) {
              this.resetAdsCount();
              this.playSample(url);
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  generateSound() {
    return new Promise<string>((resolve, reject) => {
      if (
        this.oldData.text === this.textAreaValue &&
        this.oldData.speaker === this.selectedSpeaker
      ) {
        this.playSample(this.oldData.url);
        this.isLoading = false;
        return;
      }
      this.isDownloadButtonEnabled = false;
      const id = this._gfunc.generateID();
      const body = {
        audio_id: id,
        language: this.currentLangSelect,
        speaker: this.selectedSpeaker,
        speed: '1',
        text: this.textAreaValue,
        text_delay: this.textAreaValue,
        type_voice: 'wav',
        volume: '100',
      };

      this._tts.generateVoiceNoToken(body).subscribe(async (res) => {
        if (res.type === 'application/json') {
          const msg: { message: string; status: number } = JSON.parse(
            await res.text(),
          );
          return this._dialog.warning(msg.message);
        }

        const url = URL.createObjectURL(res);
        this.oldData = {
          text: body.text,
          speaker: body.speaker,
          url: url,
        };
        this.isDownloadButtonEnabled = true;
        this.isLoading = false;
        resolve(url);
        // this.playSample(url);
      });
    });
  }

  playSample(audioURL: string) {
    // this.mutateList[index].isPlaying = !this.mutateList[index].isPlaying;
    if (!this.isAudioPlay) {
      this.stopAll();
      this.audio.src = audioURL;
      this.audio.play();
      this.isAudioPlay = true;
    } else {
      this.stopAll();
    }

    this.audio.addEventListener('ended', () => {
      this.stopAll();
    });
  }

  stopAll() {
    this.isAudioPlay = false;
    this.audio.pause();
  }
  showModal = false;
  modalMessage = '';
  downloadCount = 3;
  maxDownloads = 3;
  isDownloadLimitReached = false;

  downloadAudio() {
    if (this.downloadCount > 0 && this.oldData.url) {
      const link = document.createElement('a');
      link.href = this.oldData.url;
      link.download = 'downloaded_audio.wav'; // or .mp3
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.downloadCount--;

      if (this.downloadCount === 0) {
        this.modalMessage = this.text.headerlanding.limitdownlaod;
        this.isDownloadLimitReached = true;
        this.openModel();
      } else if (this.downloadCount === 1) {
        this.modalMessage = this.text.headerlanding.downloadCount;
        this.openModel();
      }
    } else {
      this.modalMessage = this.text.headerlanding.limitdownlaod;
      this.isDownloadLimitReached = true;
      this.openModel();
    }
  }
  openModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  closeModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  mediaCenter() {
    this.router.navigate(['/media']).then((res) => {
      if (res) {
        // Trigger function to get language from url-path
        // this.getLanguageParam();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  navigateToUrl(url: string) {
    window.open(url, '_blank');
  }

  contentLink = [
    'https://www.youtube-nocookie.com/embed/G2uaZROAWx0',
    'https://www.youtube-nocookie.com/embed/qyATflZ8P40',
  ];
  teacherLink = [
    'https://www.youtube-nocookie.com/embed/G2uaZROAWx0',
    'https://www.youtube-nocookie.com/embed/qyATflZ8P40',
  ];
  novelLink = [
    'https://www.youtube-nocookie.com/embed/G2uaZROAWx0',
    'https://www.youtube-nocookie.com/embed/qyATflZ8P40',
  ];
  podcastLink = [
    'https://www.youtube-nocookie.com/embed/G2uaZROAWx0',
    'https://www.youtube-nocookie.com/embed/qyATflZ8P40',
  ];
}
