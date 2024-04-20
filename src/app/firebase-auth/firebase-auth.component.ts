import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { EN } from '../shared/change_language/EN';
import { TH } from '../shared/change_language/TH';
import { NonceService } from '../shared/services/nonce.service';
import { TAuthPage, TErrorMessageMapping } from '../auth/models/auth-model';
import { TFirebaseAuth, TFirebaseOobCode } from './models/firebase-auth-model';
import { getTitleAndButtonMapping } from './functions/functions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-firebase-auth',
  templateUrl: './firebase-auth.component.html',
  styleUrls: ['./firebase-auth.component.scss'],
})
export class FirebaseAuthComponent implements OnInit {
  isLoading = false;

  text: TFirebaseAuth = EN.firebaseAuthObj;
  errorMessageMapping: TErrorMessageMapping = null;
  page: TAuthPage = 'SignIn';
  isCanva = false; // Canva activity
  isEmail = false; // Email activity

  isSignup = false; // SignUp activity
  isExistedState = false;
  // True when created account and send verify email
  IsAccountCreated = false;

  // True when submit email on forget password form
  IsSendResetEmail = false;
  oobCode: string = null;
  get title() {
    return getTitleAndButtonMapping(this.page, this.text).title;
  }

  get otherText() {
    return this.isSignup ? this.text.sign_in : this.text.sign_up;
  }

  get otherTextLink() {
    return this.isSignup ? this.text.exist_account : this.text.no_account;
  }

  constructor(
    public _fbAuth: FirebaseAuthService,
    public _auth: AuthService,
    private _changelanguage: ChangeLanguageService,
    private _nonce: NonceService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: Pick<TFirebaseOobCode, 'oobCode' | 'mode'>,
  ) {
    if (this.data?.mode) {
      this.isEmail = true;
      this.oobCode = this.data.oobCode;
      switch (data.mode) {
        case 'verifyEmail':
          this.setPage('State__Success_VerifyEmail');
          break;
        case 'resetPassword':
          this.setPage('ResetPassword');
          break;
      }
    }
  }

  ngOnInit(): void {
    // this._fbAuth.createAccount({ email: 'pueert1324@gmail.com', password: '123465789' })
    // this._fbAuth.signIn()
    // Get canva data
    this.isCanva = JSON.parse(sessionStorage.getItem('CanvaData'));
    console.log('canvadata', this.isCanva);

    // Change height
    const element = document.getElementById('box-content');
    const path = window.location.pathname as '/redirect-url';

    if (path === '/redirect-url') {
      element.style.height = '100vh';
      this.isCanva = true;

      // Verify nonce
      this._nonce.verifyNonce();
    } else {
      // element.style.height = '400px'
      this.isCanva = false;
    }

    this._changelanguage.language.subscribe((res) => {
      if (path === '/redirect-url') {
        this.get_dataChangelanguage('EN');
      } else if (res) {
        this.get_dataChangelanguage(res);
      }
    });
  }

  get_dataChangelanguage(temp: 'TH' | 'EN') {
    if (temp == 'TH') {
      this.text = TH.firebaseAuthObj;
      this.errorMessageMapping = TH.errorMessageMapping;
    } else if (temp == 'EN') {
      this.text = EN.firebaseAuthObj;
      this.errorMessageMapping = EN.errorMessageMapping;
    }
  }

  toggleEmailForm() {
    this.isEmail = true;
  }

  toggleLoading(boo: boolean) {
    this.isLoading = boo;
  }

  onUserAuth() {
    if (!this.isSignup) {
      this.page = 'SignUp';
    } else {
      this.page = 'SignIn';
    }
    this.isSignup = !this.isSignup;
  }

  setPage(page: TAuthPage) {
    if (page === 'ForgotPassword') {
      this.isSignup = true;
    }

    // Check state page
    this.isExistedState =
      page.includes('State') ||
      page === 'ResetPassword' ||
      page === 'ForgotPassword'
        ? true
        : false;

    // Set page
    this.page = page;
  }
}
