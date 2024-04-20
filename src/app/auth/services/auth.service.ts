import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import liff from '@line/liff';

import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogFullUsersComponent } from 'src/app/dialog/components/dialog-full-users/dialog-full-users.component';
import { CanvaAuthentication, UserData } from '../models/auth-model';

import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SurveyComponent } from 'src/app/dialog/components/survey/survey.component';
import { TAPIResponse } from 'src/app/shared/models/shared-model';
import { SpeakerData } from 'src/app/voice/models/conversation-model';
const { liff_id, webapi } = environment;
interface GetStarterData {
  name: 'user' | 'speaker' | 'cart';
  data: any;
}

interface GetProfileResponse {
  status: number;
  data: UserData;
  message: string;
  uid?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  data = new BehaviorSubject<UserData>(null);
  private expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
  private cookieObj = {
    name: '_bn_token', // Cookie name
    path: '/', // Cookie path // Set 8 hours expire time (0.1 = 1 hour)
    expires: this.expiresAt, // Cookie expire
  };
  private counter = 0; // Counter API was fetching by speaker and cart (max 2)

  constructor(
    private http: HttpClient,
    private router: Router,
    private _gfunc: GlobalFunctionService,
    private _speaker: SpeakerService,
    private dialog: MatDialog,
    private cookie: CookieService,
  ) {}

  getUserData() {
    return this.data.getValue();
  }
  surveyOpen() {
    if (
      (this.getUserData().survey === undefined ||
        this.getUserData().survey === false) &&
      (this.getSurveyCookie('_bn_survey_cd') === 'true' ? false : true)
    ) {
      this.dialog.open(SurveyComponent, {
        disableClose: true,
      });
    }
  }

  async lineLogin() {
    await liff
      .init({
        liffId: liff_id,
        withLoginOnExternalBrowser: true,
      })
      .catch(() => {
        this._gfunc.removeLocalStorageByValue('LIFF_STORE');
        liff.logout();
      });
    if (liff.isLoggedIn()) {
      return this.router.navigate(['/']);
    }
  }

  logIn(token: string, page?: 'buyPoint') {
    this.setTokenCookie(token);
    if (page === 'buyPoint') {
      this.router.navigate(['payment'], { queryParams: { page: 0 } });
    } else {
      // Existed user data
      this.data.subscribe((user) => {
        if (user) {
          // Read agreement
          if (!user?.agreement) {
            this.router.navigate(['/agreement']);
          } else {
            // Default
            this.router.navigate(['/tts/conversation']);
            this.surveyOpen();
          }
        }
      });
    }
  }

  /**
   * Set token to cookie to keep user session on platform
   * @param token
   */
  private setTokenCookie(token: string) {
    const { name, path, expires } = this.cookieObj;
    this.cookie.set(name, token, {
      expires,
      path,
    });
  }

  logOut() {
    // Use finally instead of then for prevent can't logout on root page
    this.router.navigate(['/']).finally(() => {
      // this.fetchLogout();
      this._gfunc.removeLocalStorageByValue('LIFF_STORE');
      this.clearSessionStorageKeys();
      // this._gfunc.clearAllCookies();
      this.data.next(null);
      this.deleteCookieWhenSignOut();
    });
  }

  /** Remvoe session storage keys without clear all */
  private clearSessionStorageKeys() {
    const keysToRemove = [
      'cart',
      'addcart',
      'LIFF_STORE',
      'pinned_status',
      'speaker',
      'token',
    ];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  }

  fetchPersonalForm(data: any) {
    const token = 'Bearer ' + this.getToken();
    const header = new HttpHeaders({
      Authorization: token,
    });
    return this.http.post(webapi + '/payment/personal_form', data, {
      headers: header,
    });
  }

  public getToken() {
    return this.cookie.get(this.cookieObj.name);
  }

  public deleteToken() {
    this.cookie.delete(this.cookieObj.name, '/');
  }

  /**
   * Get reponse header
   */
  getHeader() {
    const token = 'Bearer ' + this.getToken();
    const header = new HttpHeaders({
      Authorization: `${token}`,
      'ngrok-skip-browser-warning': '564',
    });

    return { headers: header };
  }

  getUpdateUser() {
    const token = 'Bearer ' + this.getToken();
    const header = new HttpHeaders({
      Authorization: token,
    });
    this.http
      .get<GetProfileResponse>(webapi + '/dashboard/get_profile', {
        headers: header,
      })
      .subscribe({
        next: (resp) => {
          if (resp) {
            // Force blacklist user log-out
            if (resp.data?.blacklist) {
              this.logOut();
            }

            // Get user data and pass to variables
            let user = resp.data;

            // TODO Find a time to test and remove
            if (user.subscription === 'Compensate_basic') {
              // The compensate_sub is made for use in subscription page
              user.compensate_sub = 'Compensate_basic';
              user.keep_sub = 'Compensate Advanced';
              user.subscription = 'Advanced';
            } else if (user.subscription === 'Compensate_proplus') {
              user.compensate_sub = 'Compensate_proplus';
              user.keep_sub = 'Compensate Pro+';
              user.subscription = 'Pro plus';
            }
            // Assigning data
            this.data.next(user);
          } else {
            // Not in whitelist
            if (resp.message === 'user_id not in whitelist') {
              this.dialog.open(DialogFullUsersComponent, {
                width: '700px',
                data: {
                  uid: resp!.uid,
                  token: token,
                },
              });
            } else if (resp.message === 'Queue Full') {
              // redirect to queue page
              document.location.href = resp.url;
            }

            // Delay and force user logout
            setTimeout(() => {
              this.logOut();
            }, 0);
          }
        },
        error: (err) => {
          console.warn(err);
          this.logOut();
        },
      });
  }

  /** Fetch to get user profile data from server */
  public handleStarterData() {
    // { user: any, speaker: any[], cart: any[] }
    return new Observable<GetStarterData>((sub) => {
      const isCanva = sessionStorage.getItem('CanvaData');

      // If token not existed || Canva data existed
      if (!this.getToken() || isCanva) {
        return sub.complete(); // Complete observable
      }

      // Fetch API to get user profile
      this.getUpdateUser();

      // After fetched, try to get user data from variable
      this.data
        .pipe(
          filter((resp) => !!resp), // Positive value can pass
          take(1), // Do only once then unsubscribe
        )
        .subscribe((user) => {
          sub.next({ name: 'user', data: user });

          // Get speakers data
          this.fetchStarterData(sub, 'speaker');
          this.fetchStarterData(sub, 'cart');
        });
    });
  }

  private fetchStarterData(sub: Subscriber<any>, name: GetStarterData['name']) {
    // Format name of API
    const nameAPI = 'fetch' + this._gfunc.uppercaseFirst(name);

    const items: any[] = JSON.parse(sessionStorage.getItem(name));
    // Fetching API if Session Storage empty
    if (!items || items?.length <= 0) {
      this._speaker[nameAPI]().subscribe({
        next: (res: TAPIResponse<SpeakerData>) => {
          const data = res.data;
          if (data) {
            sessionStorage.setItem(name, JSON.stringify(data)); // 'cart' and 'speaker' on Session Storage
            sub.next({ name, data }); // Pass data
            this.counter++;
          }
        },
        complete: () => {
          if (this.counter >= 2) sub.complete(); // Only complete when got cart data
        },
      });
    } else {
      const data = JSON.parse(sessionStorage.getItem(name));
      sub.next({ name, data }); // Pass data
      if (this.counter >= 2) sub.complete(); // Only complete when got cart data
    }
  }

  liff(token: string, canvaData?: CanvaAuthentication) {
    let header = new HttpHeaders({
      'botnoi-token': 'Bearer ' + token,
    });

    let url = webapi + '/dashboard/liff';

    // Check canva
    if (canvaData) {
      const { canva_user_token } = canvaData;
      const header = new HttpHeaders({
        'botnoi-token': 'Bearer ' + token,
        'canva-token': 'Bearer ' + canva_user_token,
      });
      return this.http.get<any>(url, {
        headers: header,
      });
    }

    return this.http.get<any>(url, { headers: header });
  }

  /** Fetching API to delete user account */
  deleteAccount() {
    const header = new HttpHeaders({
      Authorization: `${'Bearer ' + this.getToken()}`,
    });
    const url = webapi + '/dashboard/delete_user_data';
    return this.http.get<any>(url, { headers: header });
  }

  // Fetching API to clear the activity user
  fetchLogout() {
    const user_id = this.data.getValue()?.user_id;
    const url = webapi + '/whitelist/logout_session?user_id=' + user_id;
    this.http.get<any>(url).subscribe();
  }

  getSurveyCookie(name: string) {
    const cookieValue = this.cookie.get(name);
    if (cookieValue === 'true') {
      return cookieValue;
    }
  }
  private deleteCookie(name: string): void {
    this.cookie.delete(name, '/');
  }

  deleteCookieWhenSignOut() {
    const cookieList = [
      '_bn_token',
      '_bn_currency',
      '_bn_countdowntime',
      '_bn_survey_completed',
    ];
    cookieList.forEach((cookie) => this.deleteCookie(cookie));
  }
}
