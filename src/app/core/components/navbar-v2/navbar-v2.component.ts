import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { FirebaseAuthService } from 'src/app/firebase-auth/services/firebase-auth.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { FormControl } from '@angular/forms';
import { Language, TypeCurrency } from 'src/app/shared/models/shared-model';
import { language } from 'src/app/shared/change_language/language';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { InviteService } from 'src/app/shared/services/invite.service';
import { NewsFormComponent } from 'src/app/dialog/components/news-form/news-form.component';
import { DialogApiService } from 'src/app/dialog/services/dialog-api.service';
import { UserData } from 'src/app/auth/models/auth-model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { TDialogPaidData } from 'src/app/payment/models/wallet-model';
import { AdsService } from 'src/app/voice/services/ads.service';
import { DialogResetSubscriptionComponent } from 'src/app/dialog/components/dialog-reset-subscription/dialog-reset-subscription.component';
import { DialogAdsComponent } from 'src/app/dialog/components/dialog-ads/dialog-ads.component';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CookieService } from 'ngx-cookie-service';

const { voice_document_url } = environment;

@Component({
  selector: 'app-navbar-v2',
  templateUrl: './navbar-v2.component.html',
  styleUrls: ['./navbar-v2.component.scss'],
})
export class NavbarV2Component implements OnInit {
  text = language['TH'].navbarObj;
  tutorialUrl = {
    th: ['https://youtu.be/8IwavnZwmlM', 'https://botnoigroup.com/voicedocTH'],
    en: [
      'https://www.youtube.com/watch?v=NqXVMOS9Gkc',
      'https://botnoigroup.com/voicedocEN',
    ],
  };

  @ViewChild('sidenav') sidenav: MatSidenav;
  // @ViewChild('menuProfile') trigger: MatMenu;
  reason = '';
  public word_store = false;

  public addcartAlert = false;
  public pathwanttoLink = '';

  // 'account',
  public RoutingDropdownProfile_1 = [
    'account',
    'subscription',
    'storage',
    'record',
    'invite',
    'code',
    'sales',
  ];
  // 'user',
  public iconMenuMobile_2 = [
    'account_dynamic',
    'package_dynamic',
    'storage_dynamic',
    'record_dynamic',
    'invite_dynamic',
    'barcode_dynamic',
    'sales_dynamic',
  ];

  public iconMenuMobile_2_white = [
    'user-w',
    'credit_white',
    'folder_white',
    'soundcloud_white',
    'sales_white',
  ];

  public RoutingDropdownProfile_2 = ['dialog/feedback-form'];

  public RoutingMenuLeft = [
    // 'tts/conversation',
    // 'tts/book',
    'tts/conversation',
    'marketplace/selectvoice',
    'media',
    'tts/api-developer',
    'payment/quote',
    'voicebot',
  ];

  public RoutingMenuMobile = [
    'tts/conversation',
    'marketplace/selectvoice',
    'media',
    'tts/api-developer',
    'payment/quote',
    'voicebot',
  ];

  // , 'premium'
  public iconMenuMobile = [
    'studio',
    'select',
    'dev',
    'price',
    'media',
    'voicebot',
  ];
  public iconMenuMobileWhite = [
    'studio_white',
    'select_white',
    'dev_white',
    'price_white',
    'media_white',
    'voicebot',
  ];

  // Nav profile menu icon
  public iconProfileMenu = [
    'account_dynamic',
    'package_dynamic',
    'storage_dynamic',
    'record_dynamic',
    'invite_dynamic',
    'barcode_dynamic',
  ];

  public sellerCode = null;
  user: UserData = null;
  copied = false;
  // currentPage: number = null
  isPremiumPage: boolean = false;
  currentPage: string;
  currentActivePage: string;

  // Default EN
  isENG = true; //true = EN, false =

  // For language changing
  speaker = [];
  cart = [];

  selectedLanguage = new FormControl<any>('TH');
  isFreeTTS: boolean;
  //#-----------------------------[Change Language]--------------------------------#

  @ViewChildren('bar') bar: QueryList<ElementRef>;

  constructor(
    private _speaker: SpeakerService,
    public _auth: AuthService,
    private _subAPI: SubscriptionAPIService,
    private router: Router,
    public location: Location,
    public _language: ChangeLanguageService,
    private dialog: MatDialog,
    private _fbAuth: FirebaseAuthService,
    private _cb: Clipboard,
    private _dialog: DialogService,
    private _invite: InviteService,
    private _dialogAPI: DialogApiService,
    private http: HttpClient,
    private _wallet: WalletService,
    private _ads: AdsService,
    private _router: Router,
    private _notify: NotificationService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.sellerCode = sessionStorage.getItem('_bn_seller_code');
    }, 1000);

    // this.firebaseSignIn()

    // Initialize default value
    this.user = {
      ...this.user,
      credits: 0,
      image: '../../../assets/img/dowload_gif5.gif',
    };

    // Change language
    this.selectedLanguage.valueChanges.subscribe((lang: Language) => {
      this.isENG = lang === 'EN';
      this.changeLanguage(this.isENG);
    });

    this._auth.data.subscribe((resp) => {
      // Check if response data is valid and credits is number type
      if (resp && typeof this.user?.credits === 'number') {
        this.user.credits = resp.credits;
        // if(old_credits <= 0) return;
        // this._gfunc.animateValue("credits_navbar", resp.credits, old_credits)
      }
    });

    this._router.events.subscribe((event) => {
      if (event) {
        const route = this._router.url.split('/');
        this.checkCurrentPage(route);

        this.isPremiumPage = this._router.url.includes('premiumvoice');
        this.isFreeTTS = this._router.url.includes('text-to-speech-voices');
      }
    });

    // this.test().subscribe()
    setTimeout(async () => {
      this.getUserCountryByIP();
      this.getProfileData();
      this.checkQRCode();
    }, 0);
  }

  ngAfterViewInit(): void {}

  animateHamburger() {
    this.bar.forEach((bar) => bar.nativeElement.classList.toggle('x'));
  }

  checkCurrentPage(route: string[]) {
    switch (route[1]) {
      case 'tts':
        if (route[2].includes('conversation')) {
          this.currentPage = 'conversation';
        } else {
          this.currentPage = 'api-developer';
        }
        break;
      case 'marketplace':
        this.currentPage = 'marketplace';
        break;
      case 'media':
        this.currentPage = 'media';
        break;
      case 'payment':
        this.currentPage = 'payment';
        break;
      default:
        this.currentPage = '';
        break;
    }
  }

  changeLangByButton(lang: string) {
    this.selectedLanguage.patchValue(lang);
    if (lang === 'EN') {
      this.changeLanguage(true);
    } else {
      this.changeLanguage(false);
    }
  }

  /**
   * Check stored qrcode data to open payment pop-up again.
   */
  private checkQRCode() {
    const qrData: TDialogPaidData['qrData'] = JSON.parse(
      localStorage.getItem('qrData'),
    );
    if (qrData) {
      this._wallet.openDialogPaid({ type: 'qr', qrData, price: qrData.price });
    }
  }

  /** Fetching API to get user ip-address and country. */
  private getUserCountryByIP() {
    // Prepare condition variables
    // If value existed, it's not get IP for
    let isCurrencyCookie = false; // For currency
    let isLangaugeSession = false; // For language

    // Check currency cookie existed
    // const currencySession = this._language.getCurrencyCookie()
    // if (currencySession) {
    //   this._language.setCurrency(currencySession)
    //   isCurrencyCookie = true
    // }

    // Check Canva user before load language
    const canvaData = sessionStorage.getItem('CanvaData');
    if (canvaData) {
      this.selectedLanguage.patchValue('EN');

      // Already changed language
      this.changeLanguage(true);
      isLangaugeSession = true;
    }

    // Check the lang is null of not, when null will default EN language
    const lang = sessionStorage.getItem('lang');
    if (lang && !isLangaugeSession) {
      this.isENG = lang === 'EN';
      this.selectedLanguage.patchValue(lang);

      // Already changed language
      this.changeLanguage(this.isENG);
      isLangaugeSession = true;
    }

    // If existed currency and language condition, It's will break the function
    if (isCurrencyCookie && isLangaugeSession) return;

    // Default case
    this.http
      .get('https://api.iplocation.net/?cmd=get-ip')
      .pipe(
        switchMap((resp: any) =>
          this.http.get(
            'https://api.iplocation.net/?cmd=ip-country&ip=' + resp.ip,
          ),
        ),
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.country_code2) {
            // Prepare variables
            const lang: Language = resp.country_code2;
            this.isENG = lang === 'EN';
            // const currency: TypeCurrency = lang === 'TH' ? 'thb' : 'usd';

            // Set values on variables
            // this._language.setCurrency(currency)
            // this._language.setCurrencyCookie(currency) // Set session storage

            // Not existed language session, Do if condition
            if (!isLangaugeSession) {
              if (lang === 'TH') this.selectedLanguage.patchValue(lang);
              this.changeLanguage(this.isENG);
            }
          }
        },
        error: (err) => {
          // Not Change and still default TH langauge
          console.warn(err);
        },
      });
  }

  firebaseSignIn() {
    this._fbAuth.toFirebaseAuth();
  }

  close(reason: string) {
    this.bar.forEach((bar) => (bar.nativeElement.classList = 'bar'));
    this.reason = reason;
    this.sidenav.close();
  }

  /** Copy UID to clipboard and switch display status between copy and done icons */
  copyUID(copy: HTMLSpanElement, done: HTMLSpanElement) {
    this._cb.copy(this.user.uid);

    this.copied = true;

    /* Display done icon */
    copy.style.display = 'none';
    done.style.display = 'block';

    /* After 1 second, display copy icon */
    setTimeout(() => {
      copy.style.display = 'block';
      done.style.display = 'none';
    }, 1000);

    setTimeout(() => {
      this.copied = false;
    }, 0);
  }

  updateUrl() {
    this.user.image = '../../../assets/icons/default_picture.svg';
  }

  removeFacebookAccount() {
    this.router.navigate(['facebook/delete']);
  }

  routerLinkto(path: string) {
    const user = this._auth.data.getValue();

    if (path === 'voicebot') {
      return (window.location.href = 'https://botnoigroup.com/voicebot');
    }

    // this.currentPage = index
    /* return to landing page */
    if (path?.length == 0 && !user?.agreement) {
      this.router.navigate(['/']);
      return this._auth.logOut();
    }

    /* false agree return to agreement page */
    if (user?.agreement === false) {
      this.closeSideNav();
      return this.router.navigate(['/agreement']);
    }
    if (path === 'account') {
      this.closeSideNav();
      return this.router.navigate(['account'], { queryParams: { page: 0 } });
    }
    if (path === 'subscription') {
      this.closeSideNav();
      return this.router.navigate(['account'], { queryParams: { page: 1 } });
    }

    if (path === 'record') {
      this.closeSideNav();
      return this.router.navigate(['payment'], { queryParams: { page: 3 } });
    }

    if (path === 'invite') {
      this.closeSideNav();
      return this.router.navigate(['payment'], { queryParams: { page: 2 } });
    }

    if (path === 'code') {
      this.closeSideNav();
      return this.router.navigate(['payment'], { queryParams: { page: 4 } });
    }

    if (
      sessionStorage.getItem('addcart') != null &&
      JSON.parse(sessionStorage.getItem('addcart')).length > 0
    ) {
      this.pathwanttoLink = path;
      this.addcartAlert = true;
    } else if (path == 'doc') window.open(voice_document_url, '_blank');
    else {
      // this.checkRouter(path);
      this.router.navigate(['/' + path]);
    }
    this.closeSideNav();
  }

  closeSideNav() {
    /* always close after passed the function */
    this.close('toggle button');
    this.close('matMenuItem-dropdown');
  }

  toDeleteAccount() {
    this.router.navigate(['/auth/facebook/delete'], {
      queryParams: { state: 'delete' },
    });
  }

  // /** Open events and news dialog */
  openNewsDialog(user: any) {
    const resp = this._auth.data.getValue();
    const sub = String(resp?.subscription);

    // Not display for unlimited package
    if (sub === 'Unlimited') return;

    // Clear specific localstorage item
    localStorage.removeItem('hideNewsUntil');

    /* get date time from local storage */
    // const until = Number(localStorage.getItem('hideNewsUntil'));

    /* Hide dialog when until has datetime value */
    // if (until && new Date().getTime() < until) return;

    /* Otherwise, show dialog */
    this.dialog
      .open(NewsFormComponent, {
        maxWidth: '558px',
        width: '90%',
        data: user,
      })
      .afterClosed()
      .subscribe(() => {
        this._dialogAPI.alreadyShowDialog().subscribe();
      });
  }

  private formatProfile(res: UserData) {
    const limit = 10;
    this.user = res;
    this.user.username = res?.username ? res?.username.slice(0, limit) : '';
  }

  navigateTutorial(index: number) {
    const lang = (this.isENG === true ? 'EN' : 'TH').toLowerCase();
    window.open(this.tutorialUrl[lang][index], '_blank');
  }

  private getProfileData() {
    this._auth.handleStarterData().subscribe({
      next: (res) => {
        if (res.name === 'user') {
          const user: UserData = res.data;

          // Check old subscription

          /* Format data on user profile */
          this.formatProfile(user);

          // Get sound sample ads list
          this._ads.fetchGetAds();

          // Get Invite code from local storage
          this.getInviteCode();

          // TODO Not use pop-up, Change true to false in DB
          // Open dialog for introduce subscription feature
          // if (user?.popup !== true) this.openNewsDialog(user);

          /* After get user profile, fetch subscription package */
          // get Buy point package
          this._wallet.getPackage();

          this._subAPI.getSubscriptionPackage();
        } else {
          // Assign the value to variables
          this[res.name] = res.data;

          // Format speaker data based on the language
          this.changeSpeakerLanguage(this.selectedLanguage.value, res.name);
        }
      },
    });
  }

  private changeSpeakerLanguage(lang: string, name: 'speaker' | 'cart') {
    // Assign format data to variables
    this[name] = this.formatSpeakerData(lang, this[name]);

    // Prepare const variable
    const $name = '$' + name;

    // Assign data to behavior subject
    this._speaker[$name].next(this[name]);
  }

  private formatSpeakerData(lang: string, arr: any[]) {
    arr.forEach((e) => {
      if (lang === 'EN') {
        e.name = e.eng_name;
        e.global_gender = e.eng_gender;
        e.global_speech_style = e.eng_speech_style;
        e.global_voice_style = e.eng_voice_style;
      } else {
        e.name = e.thai_name;
        e.global_gender = e.gender;
        e.global_speech_style = e.speech_style;
        e.global_voice_style = e.voice_style;
      }
    });

    return arr;
  }

  /** Sign out function for clear any data in local and session storage */
  async SignOut() {
    this._auth.logOut();
    this.word_store = false;
    this.close('toggle button');
    this._fbAuth.signOut();
  }

  /** Check user is already login */
  isLogined() {
    if (this._auth.getToken()?.length) {
      return true;
    }
    return false;
  }

  closeAlertAddcart() {
    this.addcartAlert = false;
  }

  routerLink() {
    sessionStorage.setItem('addcart', JSON.stringify([]));
    this.router.navigate(['/' + this.pathwanttoLink]);
    this.addcartAlert = false;
  }

  saveAndRouterLink() {
    let addcartlist = JSON.parse(sessionStorage.getItem('addcart'));
    let cartlist = JSON.parse(sessionStorage.getItem('cart'));
    let cartidlist = [];
    for (let s of addcartlist) {
      cartidlist.push(s.speaker_id);
      cartlist.push(s);
    }
    this._speaker.setCart(cartlist);
    sessionStorage.setItem('cart', JSON.stringify(cartlist));
    sessionStorage.setItem('addcart', JSON.stringify([]));
    this.router.navigate(['/' + this.pathwanttoLink]);
    this.addcartAlert = false;
  }

  private changeLanguage(boo: boolean) {
    const lang: Language = boo === true ? 'EN' : 'TH';
    this._language.setLanguage(lang);
    this.changeSpeakerLanguage(lang, 'speaker');
    this.changeSpeakerLanguage(lang, 'cart');
    this.text = language[lang].navbarObj;
    sessionStorage.setItem('lang', lang);
  }

  // Get invite code and check it by fetching API
  private getInviteCode() {
    setTimeout(() => {
      if (localStorage.getItem('_code')) {
        this._invite.sendCodetoServer().subscribe({
          next: (res) => {
            const message = res.message;
            if (message == 'use coupon invite friend success') {
              this._dialog.invitedSuccess();
              this._auth.getUpdateUser();
            }
          },
          error: (err: HttpErrorResponse) => {
            const message = err?.error?.message;
            if (message == "Can't use owner code") {
              this._dialog.selfCode();
            } else if (message == 'Already use invite code') {
              this._dialog.usedAlready();
            } else if (message == 'Invalid invite code') {
              this._dialog.infoCode(message);
            }
          },
        });
      }
    }, 2000);
  }
}
