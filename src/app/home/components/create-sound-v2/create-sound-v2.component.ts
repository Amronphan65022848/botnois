import { Component, HostListener } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import {
  languageObj,
} from 'src/app/voice/mocks/conversation-mock';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { MatDialog } from '@angular/material/dialog';
import { SpeakerData } from 'src/app/voice/models/conversation-model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TH_EN_flag } from 'src/app/voice/mocks/conversation-mock';
import { Language } from 'src/app/shared/models/shared-model';

type SpeakerDataCustom = {
  isPlaying?: boolean;
} & SpeakerData;

@Component({
  selector: 'app-create-sound-v2',
  templateUrl: './create-sound-v2.component.html',
  styleUrls: ['./create-sound-v2.component.scss'],
})
export class CreateSoundV2Component {
  public text = null;
  public textLang: Language = null;

  is575: boolean = false;

  selectedSpeaker: string = '';
  isLoading: boolean = false;

  currentPath: string;

  public allSpeaker: any[] = [];
  public speakerList: SpeakerDataCustom[] = [];
  public flagList = [];

  public audio = new Audio();
  public isAudioPlay: boolean = false;

  languageObj = languageObj;

  popup = false;

  panelOpenState: boolean[] = [];

  isLoggedIn: boolean;

  private $destroy = new Subject();

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _gfunc: GlobalFunctionService,
    private router: Router,
    public _auth: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 575) {
      this.is575 = true;
    } else if (event.target.innerWidth > 575) {
      this.is575 = false;
    }
  }

  async ngOnInit(): Promise<void> {
    this.getLanguageParam();
    this.flagList = TH_EN_flag;

    this.router.events.pipe(takeUntil(this.$destroy)).subscribe((event) => {
      if (event) {
        this.getLanguageParam();
      }
    });

    setTimeout(() => {
      this._changeLanguage.language
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res) {
            this.textLang = res;
            this.text = language[res].seoPageObj;
          }
        });
    }, 0);

    this.isLoggedIn = this._auth.getToken().length > 0;
  }

  ngOnDestroy() {
    this.$destroy.complete();
    this.$destroy.unsubscribe();
  }

  setSpeakerList(speakers: any) {
    this.speakerList = speakers;
  }

  setAllSpeaker(speakers: any) {
    this.allSpeaker = speakers;
  }

  // /** Handle param from domain path. */
  private getLanguageParam() {
    // Get language from path
    const languagePath = this.route.snapshot.paramMap.get('lang');

    // Get language code like 'en', 'th', ...
    const tempObj = this._gfunc.reverseKeyValue(this.languageObj);
    const languageCode = tempObj[languagePath];

    // Assign value
    const result = languageCode ? languageCode : 'en';
    this.currentPath = result;
  }

  public transformValueToText(val: string) {
    const list = TH_EN_flag;
    const result = list.filter((item) => {
      // if (item.value === val) {
      // }
      return item.value === val;
    });

    return this.textLang === 'EN' ? result[0]?.EN_name : result[0]?.TH_name;
  }

  /**
   * Play sample audio of the speaker.
   * @param item
   */
  public playSample(item: SpeakerDataCustom) {
    if (item.isPlaying) {
      item.isPlaying = false;
      this.stopAll();
    } else {
      item.isPlaying = true;
      this.playAudio(item.audio);
      this.onAudioEnd()
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => (item.isPlaying = false));
    }
  }

  private playAudio(url: string) {
    this.audio.src = url;
    this.audio.play();
    this.isAudioPlay = true;
    this.updateSpeakerStatus(true, this.selectedSpeaker);

    // When the sound ends playing
    this.onAudioEnd().pipe(takeUntil(this.$destroy)).subscribe();
  }

  private onAudioEnd() {
    return new Observable((sub) => {
      this.audio.onended = () => {
        this.isAudioPlay = false;

        this.updateSpeakerStatus(false, this.selectedSpeaker);
        sub.next(true);
      };
    });
  }

  private updateSpeakerStatus(isPlaying: boolean, speakerName: string) {
    // Update speaker playback status
    const speaker = this.speakerList.find((spk) => spk.name === speakerName);
    if (speaker) {
      speaker.isPlaying = isPlaying;
    }
  }

  private stopAll() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isAudioPlay = false;
    this.updateSpeakerStatus(false, this.selectedSpeaker);
  }

  public login() {
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

  navigateToLang(languageCode: string) {
    const languagePath = this.languageObj[languageCode];
    this.router
      .navigate([`/text-to-speech-voices/${languagePath}`])
      .then((res) => {
        if (res) {
          // Trigger function to get language from url-path
          // this.getLanguageParam();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  setPanelState(index: number, state: boolean) {
    this.panelOpenState[index] = state;
  }

  getPanelState(index: number) {
    return this.panelOpenState[index] || false;
  }
}
