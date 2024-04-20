import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  type OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import { CanvaAuthentication } from 'src/app/auth/models/auth-model';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { Social } from 'src/app/firebase-auth/models/firebase-auth-model';
import { FirebaseAuthService } from 'src/app/firebase-auth/services/firebase-auth.service';
import { NonceService } from 'src/app/shared/services/nonce.service';
import { environment } from 'src/environments/environment';
const { line_login_url } = environment;

@Component({
  selector: 'app-social-sign-in',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './social-sign-in.component.html',
  styleUrls: ['./social-sign-in.component.scss'],
})
export class SocialSignInComponent implements OnInit {
  @Input() text: any;
  @Input() isLoading: boolean;
  @Input() isEmail: boolean;
  @Output() _isEmail = new EventEmitter(false);
  @Output() _isLoading = new EventEmitter(false);
  socialList: Social[] = ['email', 'google', 'line'];
  // socialList: Social[] = ['google', 'line']
  constructor(
    private _nonce: NonceService,
    private _dialog: DialogService,
    private _fbAuth: FirebaseAuthService,
  ) {}
  ngOnInit(): void {}

  toLine() {
    const canvaData = this._nonce.getCanvaData();
    let state = 'noncanva';
    if (canvaData) {
      state = `${canvaData.state}_token_${canvaData.canva_user_token}`;
    }

    const url = `${line_login_url}&state=${state}`;
    window.location.href = url;
  }

  sliceArrays() {
    let tempArray = this.socialList;
    if (this.isEmail) tempArray = tempArray.slice(1);
    return tempArray;
  }

  authenticateWithProvider(social: Social) {
    if (social === 'email') {
      return this.toggleEmailForm();
    }

    if (social === 'line') {
      this.toLine();
    } else {
      this.signInWithProvider(social);
    }
  }

  toggleEmailForm() {
    this._isEmail.emit(true);
  }

  async signInWithProvider(social: Social) {
    this._isLoading.emit(true);
    const canvaData: CanvaAuthentication = JSON.parse(
      sessionStorage.getItem('CanvaData'),
    );
    const temp = {
      google: GoogleAuthProvider,
      facebook: FacebookAuthProvider,
    };
    const vars = temp[social];
    const provider: GoogleAuthProvider | FacebookAuthProvider = new vars();
    /* add scope */
    provider.addScope('email');

    /* force user to input email */
    provider.setCustomParameters({ prompt: 'select_account' });

    const { auth } = this._fbAuth.firebaseInit();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        this._isLoading.emit(false);
        const token = await result.user.getIdToken();
        this.fetchFirebaseAuthAPI(token, canvaData);
      })
      .catch((err) => {
        this._isLoading.emit(false);
        // Handle Errors here.
        if (canvaData) {
          window.location.replace(
            `https://www.canva.com/apps/configured?success=false&state=${
              canvaData.state
            }&errors=${err?.error.message ?? JSON.stringify(err?.error)}`,
          );
        }
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      });
  }

  fetchFirebaseAuthAPI(token: string, canvaData: CanvaAuthentication) {
    this._fbAuth.fetchFirebaseAuth(token, canvaData).subscribe({
      next: (resp) => {
        if (canvaData) {
          const params = new URLSearchParams({
            success: 'true',
            state: canvaData.state,
          });
          const url = `https://www.canva.com/apps/configured?${params.toString()}`;
          window.location.replace(url);
        } else {
          window.location.href = resp.message;
        }
      },
      error: (err) => {
        if (canvaData) {
          window.location.replace(
            `https://www.canva.com/apps/configured?success=false&state=${
              canvaData.state
            }&errors=${err?.error.message ?? JSON.stringify(err?.error)}`,
          );
        }
        // this._dialog.error('Error code: BNV487');
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }
}
