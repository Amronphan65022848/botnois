import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { NotificationService } from '../shared/services/notification.service';
import { ComponentQueueService } from './services/component-queue.service';
import { homeObj } from './mocks/home-mock';

import { CanvaAuthentication } from '../auth/models/auth-model';
import { GlobalFunctionService } from '../shared/services/global-function.service';

import { environment } from 'src/environments/environment';
import { TH_EN_flag, languageObj } from '../voice/mocks/conversation-mock';
import { LanguageService } from 'typescript';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { SpeakerData } from '../voice/models/conversation-model';
import { TextspeechService } from '../shared/services/textspeech.service';
import { speakerDataMock } from '../marketplace/data/data';
const { liff_id } = environment;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public value: any = 0;
  isMainPage = false;
  isLoading = false;
  isOpen = false;
  isFirstComponentLoaded = false;
  homeObj = homeObj;
  componentLoaded = 10;

  $pageVisible: Observable<boolean>;
  isLoggedin: boolean;

  languageObj = languageObj;
  allSpeaker: SpeakerData[] = null;
  constructor(
    private _auth: AuthService,
    private _dialog: DialogService,
    private _compontentQueue: ComponentQueueService,
    private cd: ChangeDetectorRef,
    private _tts: TextspeechService,
  ) {
    this.autoLogin();
  }

  ngOnInit(): void {
    this.isMainPage = true;

    if (this._auth.getToken()?.length) {
      this.isLoggedin = true;
    } else {
      this.isLoggedin = false;
    }

    this.getSpeaker();
  }

  getSpeaker() {
    this._tts.getSpeakers().subscribe({
      next: (response) => {
        this.allSpeaker = response.data;
        sessionStorage.setItem('speaker', JSON.stringify(response.data));
      },
      error: (error) => {
        this.allSpeaker = speakerDataMock;
        sessionStorage.setItem('speaker', JSON.stringify(speakerDataMock));
        console.error('Error fetching speakers:', error);
      },
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // const home = document.getElementById('home-container')
    // home.insertAdjacentHTML('beforeend','<app-creative-work-v2></app-creative-work-v2>')
    // this._compontentQueue.$componentsLoaded.subscribe((res) => {
    //   if (res) {
    //     this.componentLoaded = 10;
    //   }
    // });
    // this.cd.detectChanges();
  }

  onChange(UpdatedValue: string): void {
    this.value = UpdatedValue;
  }

  componentsLoaded(event: boolean) {
    this.isFirstComponentLoaded = event;
  }

  getValue(num: any) {
    this.value = num;
  }

  async autoLogin() {
    await liff.init({
      liffId: liff_id,
    });
    //check jwt on session storage
    if (this._auth.getToken() || !this.isMainPage) return;
    else if (liff.isLoggedIn()) {
      // const body = liff.getDecodedIDToken()
      const body = liff.getIDToken();
      this.isLoading = true;
      const canvaData: CanvaAuthentication = JSON.parse(
        sessionStorage.getItem('CanvaData'),
      );

      this._auth.liff(body, canvaData).subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (canvaData) {
            this._auth.logOut();
            setTimeout(() => {
              window.location.replace(
                'https://www.canva.com/apps/configured?success=true&state=' +
                  canvaData?.state,
              );
            }, 500);
          } else {
            window.location.href = resp.message;
          }
        },
        error: (err) => {
          liff.logout();
          this._auth.logOut();
          if (canvaData) {
            window.location.replace(
              `https://www.canva.com/apps/configured?success=false&state=${
                canvaData.state
              }&errors=${err?.error.message ?? JSON.stringify(err?.error)}`,
            );
          }
          this.isLoading = false;
          // Error invalid token pop-up
          this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
        },
      });
    } else {
      liff.logout();
      this._auth.logOut();
    }
  }
}
