import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
})
export class QuoteComponent implements OnInit {
  text = null;
  public isMobile: boolean;
  public isLogin: boolean = null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1000) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  constructor(
    private _language: ChangeLanguageService,
    private _auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this._language.language.subscribe((resp) => {
      this.text = language[resp].quoteObj;
    });
    if (window.innerWidth <= 1000) {
      this.isMobile = true;
    }

    if (this._auth.getToken()) {
      this.isLogin = true;
      this.router.navigate(['/payment']);
    } else {
      this.isLogin = false;
    }
  }

  gotoDocs() {
    window.open(
      'https://docs.google.com/document/d/1v2lmehMG6Jie8WrbnfGCf4Wa-odwN26VxATnwm4_qT4/edit?usp=sharing',
      '_blank'
    );
  }
}
