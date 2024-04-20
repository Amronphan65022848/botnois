import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-seo',
  templateUrl: './footer-seo.component.html',
  styleUrls: ['./footer-seo.component.scss'],
})
export class FooterSeoComponent {
  lang: string;

  constructor(private router: Router) {}

  navigate(path: string, sub_path: string) {
    this.router.navigate([`/${path}/${sub_path}`]);
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

  toTwitter() {
    window.open('https://twitter.com/iambotnoi', '_blank');
  }
}
