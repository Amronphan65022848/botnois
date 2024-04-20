import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FirebaseAuthService } from 'src/app/firebase-auth/services/firebase-auth.service';
import { Observable } from 'rxjs';
type Pages = 'landing' | 'seo';
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent {
  @Input() speakerList: any = [];
  @Input() textLang: any;
  @Input() languageObj: any;
  @Input() flagList = [];
  @Input() allSpeaker: any;
  @Input() set _currentPath(val: string) {
    this.updateCurrentFlag(val);
  }
  @Input() page: Pages = 'landing' || 'seo';

  currentPath: string;

  public isPlaying: boolean = false;
  private audioMap = new Map<string, HTMLAudioElement>();
  private playingStates = new Map<string, boolean>();

  lang: string = null;
  currentFlag: string[] = [];
  // languageArray = ['en', 'lo', 'th', ]
  constructor(
    private router: Router,
    private fbAuth: FirebaseAuthService,
  ) {}

  ngOnInit() {}

  onSignIn() {
    this.fbAuth.toFirebaseAuth();
  }

  updateCurrentFlag(currentPath: string) {
    const matchingFlag = this.flagList.find(
      (flag) => flag.value === currentPath,
    );
    this.currentFlag = matchingFlag ? matchingFlag.flag : '';
    this.lang = matchingFlag.EN_name;
  }

  playSoundByLanguage(languageCode: string) {
    const speaker = this.allSpeaker.find((s) => s.language === languageCode);

    if (!speaker) {
      console.error(`Speaker with language code ${languageCode} not found.`);
      return;
    }
    this.audioMap.forEach((audioObj, key) => {
      if (key !== languageCode && !audioObj.paused) {
        audioObj.pause();

        this.playingStates.set(key, false);
      }
    });

    let audio = this.audioMap.get(languageCode);

    if (!audio) {
      audio = new Audio(speaker.audio);
      audio.play();
      this.audioMap.set(languageCode, audio);

      audio.onended = () => this.handleAudioEnd(languageCode);
    } else {
      if (this.playingStates.get(languageCode)) {
        audio.pause();
      } else {
        audio.currentTime = 0;
        audio.play();
      }
    }

    this.playingStates.set(languageCode, !this.playingStates.get(languageCode));
  }
  playSound(speaker: any) {
    if (!this.audioMap.has(speaker.speaker_id)) {
      const audio = new Audio(speaker.audio);
      audio.onended = () => this.handleAudioEnd(speaker.speaker_id);
      this.audioMap.set(speaker.speaker_id, audio);
    }

    const audio = this.audioMap.get(speaker.speaker_id);
    const isPlaying = this.playingStates.get(speaker.speaker_id) || false;

    if (isPlaying) {
      audio.pause();
    } else {
      this.audioMap.forEach((audioObj, id) => {
        if (id !== speaker.speaker_id && !audioObj.paused) {
          audioObj.pause();
          this.playingStates.set(id, false);
        }
      });
      audio.currentTime = 0;
      audio.play();
    }
    this.playingStates.set(speaker.speaker_id, !isPlaying);
  }

  handleAudioEnd(speakerId: string) {
    this.playingStates.set(speakerId, false);
  }

  isSpeakerPlaying(speakerId: string): boolean {
    return this.playingStates.get(speakerId) || false;
  }

  ngOnDestroy() {
    this.audioMap.forEach((audio) => audio.pause());
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
}
