import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { FirebaseError, initializeApp } from '@firebase/app';

import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  applyActionCode,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from '@firebase/auth';

import { DialogService } from 'src/app/dialog/services/dialog.service';
import { AuthenticateData } from '../models/firebase-auth-model';
import { CanvaAuthentication } from 'src/app/auth/models/auth-model';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseAuthComponent } from '../firebase-auth.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';

const { firebaseConfig, liff_id, webapi } = environment;
@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(
    private _auth: AuthService,
    private _dialog: DialogService,
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  toFirebaseAuth(oobCode?: string, mode?: string) {
    const width = window.innerWidth;
    if (width < 576) {
      this.router.navigate(['authenticatate']);
    } else {
      this.dialog.open(FirebaseAuthComponent, { data: { oobCode, mode } });
    }
  }

  fetchFirebaseAuth(token: string, canvaData?: CanvaAuthentication) {
    let header = new HttpHeaders({
      'botnoi-token': 'Bearer ' + token,
    });

    let url = webapi + '/dashboard/firebase_auth';

    // Canva flow
    if (canvaData) {
      const { canva_user_token } = canvaData;
      const header = new HttpHeaders({
        'botnoi-token': 'Bearer ' + token,
        'canva-token': 'Bearer ' + canva_user_token,
        'ngrok-skip-browser-warning': '564',
      });
      return this.http.get<any>(url, { headers: header });
    }

    return this.http.get<any>(url, { headers: header });
  }

  createAccount(email: string, password: string) {
    return new Observable<boolean>((sub) => {
      const { auth } = this.firebaseInit();

      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;

          await sendEmailVerification(user);
          sub.next(true);

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          sub.error(errorCode);
        })
        .finally(() => sub.complete());
    });
  }

  async signIn(email: string, password: string) {
    const { auth } = this.firebaseInit();
    // const { email, password } = { email: 'pueert1324@gmail.com', password: '123456' }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(userCredential.user);
      const firebaseToken = await userCredential.user.getIdToken();
      return firebaseToken;
    } catch (error: any) {
      return { 'error-code': error.code };
    }
  }

  /** Fetching API to authenticate with email and password. */
  signInWithEmail(firebaseToken: string) {
    const canvaData = JSON.parse(
      sessionStorage.getItem('CanvaData'),
    ) as CanvaAuthentication;
    const canva_user_token = canvaData?.canva_user_token;
    // Check canva
    const header = new HttpHeaders({
      'firebase-token': `Bearer ${firebaseToken}`,
      'ngrok-skip-browser-warning': '564',
    });
    if (canva_user_token) {
      const header = new HttpHeaders({
        'canva-token': 'Bearer ' + canva_user_token,
      });
      return this.http.get<any>(webapi + '/dashboard/sign_in', {
        headers: header,
      });
    }
    return this.http.get<any>(webapi + '/dashboard/sign_in', {
      headers: header,
    });
  }

  /** Verify email authentication. */
  handleVerifyEmail(actionCode: string) {
    console.log('enter function.');

    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.
    const { auth } = this.firebaseInit();
    applyActionCode(auth, actionCode)
      .then((resp) => {})
      .catch((error: FirebaseError) => {
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
        this._dialog.warning(error.code);
        console.log('error', error);
      });
  }

  async sendPasswordReset(email: string) {
    const { auth } = this.firebaseInit();
    await sendPasswordResetEmail(auth, email);
  }

  handleResetPassword(actionCode: string, password: string) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    return new Observable<boolean>((sub) => {
      const { auth } = this.firebaseInit();
      // Verify the password reset code is valid.
      verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
          const accountEmail = email;

          // TODO: Show the reset screen with the user's email and ask the user for
          // the new password.
          const newPassword = password;

          // Save the new password.
          confirmPasswordReset(auth, actionCode, newPassword)
            .then((resp) => {
              // Password reset has been confirmed and new password updated.

              // TODO: Display a link back to the app, or sign-in the user directly
              // if the page belongs to the same domain as the app:
              const result = signInWithEmailAndPassword(
                auth,
                accountEmail,
                newPassword,
              );
              sub.next(true);
              // TODO: If a continue URL is available, display a button which on
              // click redirects the user back to the app via continueUrl with
              // additional state determined from that URL's parameters.
            })
            .catch((error) => {
              sub.error(error);
              // Error occurred during confirmation. The code might have expired or the
              // password is too weak.
            });
        })
        .catch((error) => {
          sub.error(error);
          // Invalid or expired action code. Ask user to try to reset the password
          // again.
        });
    });
  }

  fetchSignUpWithEmail(requestBody: AuthenticateData) {
    // const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(requestBody), 'yourSecretKey').toString();
    // console.log(encryptedData);
    // console.log(this.createJWT(requestBody));
    // const token = jwt.sign(requestBody, JWTsecretKey);
    // CryptoJS.
  }

  /** Sign out of Firebase. */
  signOut() {
    const { auth } = this.firebaseInit();
    signOut(auth);
  }

  firebaseInit() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    return { app, auth };
  }
}
