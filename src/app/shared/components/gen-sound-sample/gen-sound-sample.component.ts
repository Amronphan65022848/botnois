import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  SpeakerData,
  TLangListAll,
} from 'src/app/voice/models/conversation-model';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TH_EN_flag, languageObj } from 'src/app/voice/mocks/conversation-mock';
import { TryFullComponent } from './dialog/try-full/try-full.component';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GlobalFunctionService } from '../../services/global-function.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TextspeechService } from '../../services/textspeech.service';
import { language } from '../../change_language/language';
import { ChangeLanguageService } from '../../services/change-language.service';
import { speakerDataMock } from 'src/app/marketplace/data/data';
import { Language } from '../../models/shared-model';
import { MatTooltipModule } from '@angular/material/tooltip';

type SpeakerDataCustom = {
  isPlaying?: boolean;
} & SpeakerData;

@Component({
  selector: 'app-gen-sound-sample',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './gen-sound-sample.component.html',
  styleUrls: ['./gen-sound-sample.component.scss'],
})
export class GenSoundSampleComponent {
  // @Input() text: any;
  // @Input() textLang: string;
  @Output() onSetSpeakerList = new EventEmitter<any>();
  @Output() onSetSpeakers = new EventEmitter<any>();
  @Output() onChangeLang = new EventEmitter<any>();
  //
  text: any;
  textLang: Language;
  //
  speaker: SpeakerData[] = [];
  speakerMaleFemale: SpeakerDataCustom[];
  speakerList: SpeakerDataCustom[];

  isLoading: boolean = false;

  currentSpeaker: any;
  textAreaValue: any = '';

  downloadCount: number = 0;
  downloadMax: number = 3;
  maxText: number = 100;

  currentFlag: string;
  currentLangSelect: string;
  lang: any = null;
  flagList = [];
  selectedLangCode: string = '';

  currentPath: string;
  isSeo: boolean = false;
  isFirstIntit: boolean = true;

  isDownloadDisable: boolean = false;
  //
  public audio = new Audio();
  public isAudioPlay: boolean = false;
  public textAudioMap = new Map<string, string>();
  isGenerating: boolean = false;
  isGenerated: boolean = false;
  generatedAudioUrl: string | null = null;
  //
  isLoggedIn: boolean = false;

  languageObj = languageObj;

  private $destroy = new Subject();

  constructor(
    private dialog: MatDialog,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private _gfunc: GlobalFunctionService,
    private _auth: AuthService,
    private textspeechService: TextspeechService,
    private _language: ChangeLanguageService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSpeakers();
    this.isSeo = this.router.url.includes('text-to-speech-voices');

    this.getLanguageParam();

    this.flagList = TH_EN_flag;

    this._language.language
      .pipe(takeUntil(this.$destroy))
      .subscribe(async (res) => {
        if (res) {
          this.textLang = res;
          this.text = language[res].genSoundStandalone;
          // set lang and speakerList
          await this.setLanguageAndSpeakers(res);
        }
      });

    this.router.events.pipe(takeUntil(this.$destroy)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.isSeo) {
          const languageCode = this.getLanguageParam();
          // Get language from selected data from user
          this.currentLangSelect = languageCode;
          this.speakerList = this.filterSpeaker(languageCode);
          // this.filterGender();
          this.setCurrentSpeaker(this.speakerMaleFemale[0]);
          // this.getFlagAndLang(languageCode);
          this.onSetSpeakerList.emit(this.speakerList);
        } else {
          return;
        }
      }
    });

    // this.getFlagAndLang(this.currentLangSelect);
    this.checkAndGetCookies();

    this.onSetSpeakerList.emit(this.speakerList);
    this.onSetSpeakers.emit(this.speaker);

    this.isFirstIntit = false;

    this.textAreaValue = this.autoText[this.currentLangSelect];
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.$destroy.complete();
    this.$destroy.unsubscribe();
  }

  private async loadSpeakers(): Promise<void> {
    return new Promise((resolve, reject) => {
      const speaker = JSON.parse(sessionStorage.getItem('speaker'));
      if (speaker) {
        this.speaker = speaker;
        resolve();
        return;
      }

      this.textspeechService.getSpeakers().subscribe({
        next: (response) => {
          this.speaker = response.data;
          sessionStorage.setItem('speaker', JSON.stringify(response.data));
          resolve();
        },
        error: (error) => {
          this.speaker = speakerDataMock;
          sessionStorage.setItem('speaker', JSON.stringify(speakerDataMock));
          console.error('Error fetching speakers:', error);
          resolve();
        },
      });
    });
  }

  checkAndGetCookies() {
    if (!this.cookieService.check('bntts_f')) {
      // Set the initial value or handle as needed
      const initialValue = {
        max: this.downloadMax,
        current: 0,
        date: new Date().toISOString(),
      };
      this.cookieService.set('bntts_f', JSON.stringify(initialValue), 1);
    }

    // Access the cookie value
    const cookieValue = this.cookieService.get('bntts_f');
    const cookieObject = JSON.parse(cookieValue);

    // Check Date
    const newDate: Date = new Date();
    const oldDate: Date = new Date(cookieObject.date);
    const diff: number =
      (newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24);

    // Check diff is lower than 1, use same data stored in cookies
    if (diff < 1) {
      this.downloadCount = cookieObject.current;
    } else {
      this.downloadCount = 0;
      const initialValue = {
        max: this.downloadMax,
        current: 0,
        date: new Date().toISOString(),
      };
      this.cookieService.set('bntts_f', JSON.stringify(initialValue), 1);
    }
  }

  setCookieValue() {
    const currentCookieValue = this.cookieService.get('bntts_f');
    const cookieObject = JSON.parse(currentCookieValue);

    // Update the object with your new values
    cookieObject.current = this.downloadCount;

    const updatedCookieValue = JSON.stringify(cookieObject);
    this.cookieService.set('bntts_f', updatedCookieValue);
  }

  convertMaxToPercent() {
    return (this.textAreaValue.length / this.maxText) * 100;
  }

  private getLanguageParam() {
    // Get language from path
    const languagePath = this.route.snapshot.paramMap.get('lang');

    // Get language code like 'en', 'th', ...
    const tempObj = this._gfunc.reverseKeyValue(this.languageObj);
    const languageCode = tempObj[languagePath];

    // Assign value
    const result = languageCode ? languageCode : 'en';
    this.currentPath = result;
    if (this.route.snapshot.url.length <= 0) {
      this.currentLangSelect = '';
    } else {
      this.currentLangSelect = result;
    }

    return result;
  }

  setLanguageAndSpeakers(lang: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.speaker && lang) {
        this.speakerList = this.filterSpeaker(this.currentLangSelect);
        // this.filterGender();

        // if (this.isSeo) {
        //   this.currentLangSelect = this.currentPath;
        // } else {
        //   this.currentLangSelect = 'th';
        // }

        resolve();
      } else {
        reject();
      }
    });
  }

  // filterGender() {
  //   const list = this.speakerList;
  //   let result = [];

  //   const male = list.filter((item) => {
  //     return item.eng_gender === 'Male';
  //   });

  //   const female = list.filter((item) => {
  //     return item.eng_gender === 'Female';
  //   });

  //   if (male.length === 0) {
  //     result = [female[0], female[1]];
  //   } else if (female.length === 0) {
  //     result = [male[0], male[1]];
  //   } else {
  //     result = [male[0], female[0]];
  //   }

  //   if (this.currentLangSelect === 'th') {
  //     result = [male[1], female[0]];
  //   }

  //   this.speakerMaleFemale = result;
  // }

  switchSpeaker(event: MatSelectChange) {
    this.stopAll();
    this.textAreaValue = '';
    this.isGenerated = false;

    const speaker = event.value;
    this.currentSpeaker = speaker;
  }

  selectLang(langCode: string) {
    this.stopAll();
    this.textAreaValue = '';
    this.isGenerated = false;

    if (this.isSeo) {
      // Get language path for navigate
      const languagePath = this.languageObj[langCode];
      this.router.navigate([`/text-to-speech-voices/${languagePath}`]);
    } else {
      this.speakerList = this.filterSpeaker(langCode);
      this.currentLangSelect = langCode;
      // this.filterGender();
      this.onSetSpeakerList.emit(this.speakerList);
    }

    this.textAreaValue = this.autoText[langCode];
    this.playSampleVoice(langCode);
    // this.getFlagAndLang(langCode);
  }

  private filterSpeaker(lang: string) {
    const language = this.speakerOnEachLanguage[lang];
    let speakers = [];

    if (!language) return;

    language.map((id: string) => {
      this.speaker.map((item) => {
        if (item.speaker_id === id) {
          speakers.push(item);
        }
      });
    });

    this.currentSpeaker = speakers[0];

    return speakers;
  }

  setCurrentSpeaker(speaker: SpeakerData) {
    if (this.isAudioPlay) {
      // stop sound
      this.stopAll();
    }
    // update speaker that select and repare to create a new sound
    this.currentSpeaker = speaker;
  }

  updateSpeakerStatus(isPlaying: boolean, speakerName: string) {
    if (!speakerName) return;
    // Update speaker playback status
    const speaker = this.speakerList.find((spk) => spk.name === speakerName);
    if (speaker) {
      speaker.isPlaying = isPlaying;
    }
  }

  createTextSpeakerKey(text: string, speaker_id: string): string {
    return `${text}_${speaker_id}`;
  }

  handlePlayAudio() {
    const currentText = this.textAreaValue.trim();
    if (this.isAudioPlay || !currentText || this.isGenerating) {
      this.stopAll();
      return;
    }

    this.checkSameText(currentText);
  }

  checkSameText(text: any) {
    const inputText = text;
    const textSpeakerKey = this.createTextSpeakerKey(
      inputText,
      this.currentSpeaker.speaker_id,
    );
    const cachedUrl = this.textAudioMap.get(textSpeakerKey);

    if (cachedUrl) {
      this.playAudio(cachedUrl);
    } else {
      this.gensound(inputText, this.currentSpeaker.speaker_id);
    }
  }

  gensound(text: string, speaker_id: string) {
    this.stopAll();
    if (!text) return;
    this.isLoading = true;
    // this.isDownloadDisable = true;
    this.isGenerating = true;
    this.isGenerated = true;
    const textSpeakerKey = this.createTextSpeakerKey(text, speaker_id);

    if (!this.textAudioMap.has(textSpeakerKey)) {
      const body = {
        audio_id: this._gfunc.generateID(),
        language: this.currentLangSelect,
        speaker: speaker_id,
        speed: '1',
        text: text,
        text_delay: text,
        type_voice: 'wav',
        volume: '100',
      };

      this.textspeechService.generateVoiceNoToken(body).subscribe({
        next: (audioBlob) => {
          const newAudioUrl = URL.createObjectURL(audioBlob);
          this.textAudioMap.set(textSpeakerKey, newAudioUrl);
          this.generatedAudioUrl = newAudioUrl;
          this.isLoading = false;
          this.isGenerating = false;
          // this.isDownloadDisable = false;
          this.setCookieValue();
        },
        error: (error) => {
          console.error('Error:', error);
          this.isGenerated = false;
          this.isGenerating = false;
        },
      });
    } else {
      this.isLoading = false;
      this.isGenerating = false;
      this.playAudio(this.textAudioMap.get(textSpeakerKey));
    }
  }

  playAudio(url: string) {
    this.audio.src = url;
    this.audio.play();
    this.isAudioPlay = true;
    this.updateSpeakerStatus(true, this.currentSpeaker.speaker_id);

    // When the sound ends playing
    this.onAudioEnd().subscribe();
  }

  onAudioEnd() {
    return new Observable((sub) => {
      this.audio.onended = () => {
        this.isAudioPlay = false;

        this.updateSpeakerStatus(false, this.currentSpeaker?.speaker_id);
        sub.next(true);
      };
    });
  }

  stopAll() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isAudioPlay = false;
    this.updateSpeakerStatus(false, this.currentSpeaker?.speaker_id);
  }

  downloadAudio() {
    if (!this._auth.getToken()) {
      this.login();
      return;
    }

    if (this.generatedAudioUrl) {
      const link = document.createElement('a');
      link.href = this.generatedAudioUrl;
      link.download = 'downloaded_audio.wav'; // หรือ .mp3
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.isGenerated = false;
      this.downloadCount++;
      this.setCookieValue();

      const dataTemp = {
        text: {
          header: this.text.dialog.header,
          details: this.text.dialog.credit,
          confirm: this.text.dialog.confirm,
          newuser: this.text.dialog.details,
          newuser_colored: this.text.dialog.details_colored,
        },
        credits: this.downloadCount,
        icon: 'download_dynamic',
        icon_color: '#01BFFB',
        state: 'warn',
        method: 'success',
      };

      const ref = this.dialog.open(TryFullComponent, {
        data: dataTemp,
        maxHeight: '95vh',
        maxWidth: '95vw',
      });

      ref.afterClosed().subscribe((res) => {
        if (res) {
          this.login();
        } else {
          return;
        }
      });

      this.clearText();
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

  navigateToPayment() {
    this.router.navigate(['payment/quote']);
  }

  clearText() {
    this.textAreaValue = '';
    this.isGenerated = false;
  }

  getSampleVoice(lang: string) {
    if (lang === 'vi') {
      return 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/landing/vn.mp3';
    }

    return `https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/landing/${lang}.mp3`;
  }

  playSampleVoice(lang: string) {
    const url = this.getSampleVoice(lang);
    this.playAudio(url);
  }

  checkLogin() {
    return this._auth.getToken();
  }

  // Mock
  placeholder = {
    en: 'Try typing the sentence here.',
    id: 'Silakan ketikkan kata-kata yang Anda inginkan di sini dalam bahasa Indonesia',
    ja: 'ここに日本語でご希望の言葉を入力してください',
    lo: 'ກະລຸນາພິມຄຳສັບທີ່ທ່ານຕ້ອງການໃສ່ບ່ອນນີ້ດ້ວຍພາສາລາວ',
    my: 'ကျေးဇူးပြု၍ ဤနေရာတွင် သင်အလိုရှိသော စကားလုံးများကို မြန်မာဘာသာစကားဖြင့် ရိုက်ထည့်ပါ။',
    th: 'ลองพิมพ์ประโยคที่คุณต้องการที่นี้',
    vi: 'Vui lòng gõ từ bạn muốn vào đây bằng tiếng Việt',
    zh: '请在此用中文输入您想要的单词',
    km: 'សូមវាយពាក្យដែលអ្នកចង់បាននៅទីនេះ ជាភាសាខ្មែរ',
    fil: 'Paki-type ang salitang gusto mo dito sa Filipino',
    ar: 'يرجى كتابة الكلمات المطلوبة هنا باللغة العربية',
    de: 'Bitte geben Sie hier Ihre gewünschten Wörter in deutscher Sprache ein',
    es: 'Por favor escriba aquí las palabras que desee en idioma español',
    fr: 'Veuillez taper ici les mots souhaités en français',
    nl: 'Typ hier uw gewenste woorden met de Nederlandse taal',
    ko: '여기에 원하는 단어를 한국어로 입력해주세요',
  };

  autoText = {
    '': '',
    en: 'Nothing is worth if you are not happy',
    id: 'Hal-hal besar tidak pernah datang dari zona nyaman',
    ja: '人生は無駄にするには短すぎます',
    lo: 'ບໍ່ມີຫຍັງຄຸ້ມຄ່າຖ້າທ່ານບໍ່ພໍໃຈ',
    my: 'မပျောရင် ဘယ်အရာမှ တန်ဖိုးမရှိပါဘူး။',
    th: 'คุณไม่มีทางได้รู้จักตัวตนที่แท้จริงของตัวเองจนกว่าจะได้ออกเดินทาง',
    vi: 'Cuộc sống quá ngắn để lãng phí nó',
    zh: '生命太短，没有留下遗憾的时间',
    km: 'គ្មានអ្វីមានតម្លៃទេ ប្រសិនបើអ្នកមិនសប្បាយចិត្ត',
    fil: 'Minsan, ang pinakamahirap na desisyon ay ang pinakatama',
    ar: 'لا شيء يستحق إذا لم تكن سعيدا',
    de: 'Nichts ist etwas wert, wenn Sie nicht glücklich sind',
    es: 'Nada vale si no eres feliz',
    fr: "Rien ne vaut si tu n'es pas heureux",
    nl: 'Niets is de moeite waard als je niet gelukkig bent',
    ko: '인생은 낭비하기에는 너무 짧습니다',
  };

  googleAnalytics = {
    en: 'Eng',
    id: 'indo',
    ja: 'Japan',
    lo: 'laos',
    my: 'myanmar',
    th: 'Thai',
    vi: 'vietnamese',
    zh: 'chinese',
    km: 'khmer',
    fil: 'filipino',
    ar: 'arabic',
    de: 'german',
    es: 'spanish',
    fr: 'french',
    nl: 'dutch',
    ko: 'Korean',
  };

  speakerOnEachLanguage = {
    en: ['97', '9'],
    id: ['65', '66'],
    ja: ['63', '119'],
    lo: ['79', '78'],
    my: ['81', '84'],
    th: ['8', '1'],
    vi: ['72', '69'],
    zh: ['60', '61'],
    km: ['94', '95'],
    fil: ['147', '148'],
    ar: ['146', '148'],
    de: ['148', '147'],
    es: ['146', '148'],
    fr: ['148', '147'],
    nl: ['142', '146'],
    ko: ['147', '148'],
  };
}
