import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ChangeLanguageService } from '../../services/change-language.service';
import { language } from '../../change_language/language';

@Component({
  selector: 'app-footer-v2',
  templateUrl: './footer-v2.component.html',
  styleUrls: ['./footer-v2.component.scss'],
})
export class FooterV2Component implements OnInit {
  text = null;
  lang = null;
  currentRoute: string | string[];
  isPremiumPage: boolean = false;

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].footerV2Obj;
        this.lang = res;
      }
    });

    this._router.events.subscribe((event) => {
      if (event) {
        this.currentRoute = this._router.url;
        this.isPremiumPage = this.currentRoute.includes('premiumvoice');
      }
    });
  }

  // checkPremiumPage (route) {
  //   if (route.contain)
  // }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigate(path: string, sub_path?: string) {
    if (sub_path) {
      this._router.navigate([`/${path}/${sub_path}`]);
    } else {
      this._router.navigate([`/${path}`]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toDocs() {
    if (this.lang === 'TH') {
      window.open('https://botnoigroup.com/voicedocTH', '_blank');
    } else {
      window.open('https://botnoigroup.com/voicedocEN', '_blank');
    }
  }

  toReport() {
    window.open('https://www.facebook.com/texttospeech.botnoi', '_blank');
  }

  toWeb() {
    window.open('https://botnoigroup.com', '_blank');
  }

  toFacebook() {
    window.open('https://www.facebook.com/texttospeech.botnoi', '_blank');
  }

  toLine() {
    window.open('https://line.me/R/ti/p/@117oiwsv', '_blank');
  }

  toYoutube() {
    window.open('https://www.youtube.com/@BOTNOIGROUP', '_blank');
  }

  toTiktok() {
    window.open('https://www.tiktok.com/@botnoivoice?lang=en', '_blank');
  }
}
