import { Component, Input, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { ComponentQueueService } from '../../services/component-queue.service';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-features-update',
  templateUrl: './features-update.component.html',
  styleUrls: ['./features-update.component.scss'],
})
export class FeaturesUpdateComponent implements OnInit {
  text = null;
  textMap = null;
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
        this.text = language[res].landingPageV3Obj.feature;
        this.textMap = language[res].landingPageObj;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(3);
    }, 5000);
  }

  loginFirebase() {
    if (this.isLoggedin) {
      this.router.navigate(['/tts/workspace']);
    } else {
      this.dialog.open(FirebaseAuthComponent);
    }
  }
}
