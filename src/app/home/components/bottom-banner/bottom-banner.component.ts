import { Component, Input, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { ComponentQueueService } from '../../services/component-queue.service';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-banner',
  templateUrl: './bottom-banner.component.html',
  styleUrls: ['./bottom-banner.component.scss'],
})
export class BottomBannerComponent implements OnInit {
  text = null;

  @Input() isLoggedin: boolean;

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _compontentQueue: ComponentQueueService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].landingPageV3Obj.bottom_banner;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(4);
    }, 5000);
  }

  loginFirebase() {
    if (this.isLoggedin) {
      this.router.navigate(['/tts/conversation']);
    } else {
      this.dialog.open(FirebaseAuthComponent);
    }
  }
}
