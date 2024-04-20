import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  CanvaAuthentication,
  TAuthPage,
  TErrorMessageMapping,
} from 'src/app/auth/models/auth-model';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { FirebaseAuthService } from 'src/app/firebase-auth/services/firebase-auth.service';
import { passwordMatchValidator } from 'src/app/shared/functions/auth-function';
import { AuthOptionsComponent } from './auth-options/auth-options.component';
import { getTitleAndButtonMapping } from 'src/app/firebase-auth/functions/functions';
import { TFirebaseAuth } from 'src/app/firebase-auth/models/firebase-auth-model';
import {
  MatDialog,
  MatDialogClose,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { NgxLoadingModule } from 'ngx-loading';

type UserAuth = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    AuthOptionsComponent,
    MatDialogModule,
    NgxLoadingModule,
  ],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @Input() text: TFirebaseAuth;
  @Input() isLoading: boolean;
  @Input() page: TAuthPage;
  @Input() errorMessageMapping: TErrorMessageMapping;
  @Input() oobCode: string;
  @Output() _isLoading = new EventEmitter(false);
  @Output() _rememberPassword = new EventEmitter();
  @Output() _setPage = new EventEmitter<TAuthPage>();
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    // TODO ทำ Error Message สำหรับ passwords mismatch
    { validators: passwordMatchValidator },
  );

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetPasswordForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    // TODO ทำ Error Message สำหรับ passwords mismatch
    { validators: passwordMatchValidator },
  );
  hide = true;
  currentErrorKey: string = null;
  isAuthFormLoading = false;

  get button() {
    return getTitleAndButtonMapping(this.page, this.text).button;
  }

  get description() {
    return getTitleAndButtonMapping(this.page, this.text).description;
  }

  get sendAt() {
    return getTitleAndButtonMapping(this.page, this.text).sendAt;
  }

  constructor(
    private _fbAuth: FirebaseAuthService,
    private dialogRef: MatDialogRef<FirebaseAuthComponent>,
    private _dialog: DialogService,
  ) {}

  ngOnInit(): void {}

  async onSignIn() {
    this._isLoading.emit(true);
    const canvaData: CanvaAuthentication = JSON.parse(
      sessionStorage.getItem('CanvaData'),
    );

    const { email, password } = this.signInForm.value as UserAuth;
    const firebaseToken = await this._fbAuth.signIn(email, password);

    // Accept firebase token string
    if (typeof firebaseToken === 'string') {
      // const userCredential = await signInWithEmailAndPassword(auth, email, password)
      this._fbAuth.signInWithEmail(firebaseToken).subscribe({
        next: (resp) => {
          this._isLoading.emit(false);
          if (canvaData) {
            window.location.replace(
              'https://www.canva.com/apps/configured?success=true&state=' +
                canvaData?.state,
            );
          } else {
            // console.log('resp', resp);
            window.location.href = resp.message;
          }
        },
        error: (err: HttpErrorResponse) => {
          // console.log('err', err);
          this._dialog.error(
            `[API Error Status Code: ${err.status}] ` + err?.error.message,
          );
          this.signInForm.reset();
          this._isLoading.emit(false);
          const msg = err.error?.message;
          // console.log('msg', msg);
          if (canvaData && msg !== 'invalid Email or password') {
            window.location.replace(
              `https://www.canva.com/apps/configured?success=false&state=${canvaData.state}&errors=${err?.error.message ?? JSON.stringify(err?.error)}`,
            );
          }
        },
      });
    } else {
      this._isLoading.emit(false);

      const key: keyof TErrorMessageMapping['signIn'] =
        firebaseToken['error-code'];
      this.currentErrorKey = key;

      switch (key) {
        case 'auth/user-not-found':
          this.signInForm.get('email').setErrors({ invalid: true });
          break;
        case 'auth/wrong-password':
          this.signInForm.get('password').setErrors({ invalid: true });
          break;
        default:
          console.warn(key);
          break;
      }
      // this._dialog.error(firebaseToken['error-code']);
    }
  }

  onSignUp() {
    this.isAuthFormLoading = true;
    const { email, password } = this.signUpForm.value;
    this._fbAuth.createAccount(email, password).subscribe({
      next: (res) => {
        if (res) {
          this.setPage('State__CreateAccount');
          this.isAuthFormLoading = false;
        }
      },
      error: (err: keyof TErrorMessageMapping['signUp']) => {
        this.isAuthFormLoading = false;
        this.currentErrorKey = err;

        switch (err) {
          case 'auth/email-already-in-use':
            this.signUpForm.get('email').setErrors({ alreadyUsed: true });
            break;
          case 'auth/invalid-email':
            this.signUpForm.get('email').setErrors({ invalid: true });
            break;
          case 'auth/weak-password':
            this.signUpForm.get('password').setErrors({ invalid: true });
            break;
          case 'own/passwords-not-match':
            this.signUpForm
              .get('confirm_password')
              .setErrors({ invalid: true });
            break;

          default:
            console.warn(err);
            break;
        }
      },
    });
  }

  rememberPassword() {
    // this._rememberPassword.emit();
  }

  onForgotPassword() {
    this.setPage('ForgotPassword');
  }

  onSendPassword() {
    this.isAuthFormLoading = true;
    const { email } = this.forgotPasswordForm.value;
    this._fbAuth.sendPasswordReset(email).finally(() => {
      this.isAuthFormLoading = false;
      this.page = 'State__SendPassword';
    });
  }

  onResetPassword() {
    this.isAuthFormLoading = true;
    const { password } = this.resetPasswordForm.value;
    this._fbAuth.handleResetPassword(this.oobCode, password).subscribe({
      next: (resp) => {
        this.isAuthFormLoading = false;
        this.page = 'State__Success_ResetPassword';
      },
      error: (err) => {
        this.isAuthFormLoading = false;
      },
      complete() {},
    });
  }

  getSignInErrorMessage(controlName: string) {
    const { signIn, share } = this.errorMessageMapping;
    if (this.signInForm.get(controlName).hasError('required')) {
      return share.required;
    }

    return signIn[this.currentErrorKey] ?? '';
  }

  getSignUpErrorMessage(controlName: string) {
    const { signUp, share } = this.errorMessageMapping;
    if (this.signUpForm.get(controlName).hasError('required')) {
      return share.required;
    }
    return signUp[this.currentErrorKey] ?? '';
  }

  setPage(page: TAuthPage) {
    this.page = page;
    this._setPage.emit(page);
  }

  onClose() {
    if (this.page.includes('Success')) {
      this.setPage('SignIn');
    } else {
      this.dialogRef.close();
    }
  }

  // getErrorMessage() {
  //   if (this.email.hasError('required') || this.password.hasError('required')) {
  //     return 'You must complete the form.';
  //   }

  //   return this.signInForm.hasError('email') ? 'Not a valid email' : '';
  // }
}
