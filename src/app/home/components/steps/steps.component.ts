import { Component, Input, OnInit,HostListener } from '@angular/core';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TH_EN_flag   ,languageObj
} from 'src/app/voice/mocks/conversation-mock';
import { SpeakerData } from 'src/app/voice/models/conversation-model';


@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
  text = null;
  public langList = TH_EN_flag;
  public isScreenLarge = true;
  @Input() isLoggedin: boolean;
  languageObj = languageObj
  allSpeaker: SpeakerData[] = null
  
  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _auth: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isScreenLarge = window.innerWidth >= 992
  }

  ngOnInit(): void {
    
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].landingPageV3Obj.step;
      }
      this.onResize(window);
    });
    
  }

  loginFirebase() {
    if (this.isLoggedin) {
      this.router.navigate(['/tts/conversation']);
    } else {
      this.dialog.open(FirebaseAuthComponent);
    }
  }
}
