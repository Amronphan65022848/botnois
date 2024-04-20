import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  TPayloadUpdateAds,
  TResponseAds,
  TAds,
} from 'src/app/payment/models/ads-model';
import { TAPIResponse } from 'src/app/shared/models/shared-model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';

import { mock_a_TH } from '../mocks/mock_a';
const { webapi } = environment;

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private cookieObj = {
    name: '_bn_ads', // cookie name
    path: '/', // root path
  };
  private ads = { current: 0, max: 0 }; // Default value
  private $ads = new BehaviorSubject<TResponseAds[]>(null);
  private $singleAds = new BehaviorSubject<TResponseAds>(null);
  private $countAds = new BehaviorSubject<TPayloadUpdateAds[]>([]);
  public genCount: number = +sessionStorage.getItem('genCount') || 0;
  constructor(
    private _auth: AuthService,
    private http: HttpClient,
    private cookie: CookieService,
    private _notify: NotificationService,
  ) {}

  /**
   * Check current ads number from user
   * @returns null or ads URL
   */
  async checkAds() {
    const user = this._auth.getUserData();

    // Check No-Ads subscription to avoid ads
    const isNoAdsOld =
      user.subscription === 'NoAds' || user.subscription === 'Unlimited';
    const isNoAdsNew = user?.list_add_on?.find((e) => e.add_on === 'NoAds');

    // Old or New is true user must not against ads
    if (isNoAdsOld || isNoAdsNew) {
      this.deleteCookie();
      return null;
    }

    // Max is 0 then assign the value on max
    if (this.ads.max <= 0) {
      await this.handleFirstVisit();
    }

    // Increase current by 1 to max
    this.ads.current += 1;
    // Increase gen count by 1
    this.genCount += 1;
    sessionStorage.setItem('genCount', String(this.genCount));

    // If current is equal max then inserting ads
    if (this.ads.current >= this.ads.max) {
      return this.getRandomAds();
    }
    return null;
  }

  /**
   * Handle first visit when max is 0 then random and assign value to max
   * @param ads
   * @returns boolean
   */
  private handleFirstVisit() {
    return new Promise<boolean>(async (resolve) => {
      // Existed cookie then use cookie data instead
      const adsCookie = this.getCookie();
      if (adsCookie) this.ads = adsCookie;

      // First visit max is 0 will assign ramdom max number
      if (this.ads.max <= 0) {
        this.ads.max = await this.getRandomMax();

        // Prevent unlucky user, set base minimum max to 3
        if (this.ads.max < 5) {
          this.ads.max = 5;
        }

        // Prevent user gen voice too much , set max to 1
        const genCountSession = sessionStorage.getItem('genCount');
        if (+genCountSession >= 100) {
          this.ads.max = 1;
        }

        this.setAdsCookie();
      }

      resolve(true);
    });
  }

  private async getRandomMax() {
    // Get data from global variable
    let max = this._notify.notifyJson.getValue()?.ads?.max;

    // Undefined
    if (!max) max = 10;

    return Math.floor(Math.random() * max) + 1;
  }

  /**
   * Reset ads max.
   ** Recommend: Should reset  ads after ads pop-up closed.
   * TODO Find the way to prevent user refresh while met ads pop-up
   */
  public resetMax() {
    this.ads = { current: 0, max: 0 };
    this.deleteCookie();
  }

  /**
   * Set current ads data to cookie.
   */
  public setAdsCookie() {
    // Not need to set cookie for default value
    if (this.ads.max <= 0) return;

    // Convert the JSON object to a string
    const payload = JSON.stringify(this.ads);

    // Set the cookie with a 8-hour expiration time using ngx-cookie
    const { name, path } = this.cookieObj;
    this.cookie.set(name, payload, {
      expires: 0.8, // Set 8 hours expire time (0.1 = 1 hour)
      path,
    });
  }

  /**
   * Get cookie.
   * @returns JSON Object or null
   */
  private getCookie(): TAds | null {
    const cookieValue = this.cookie.get(this.cookieObj.name);
    return cookieValue ? JSON.parse(cookieValue) : null;
  }

  /**
   * Delete cookie.
   */
  private deleteCookie(): void {
    const { name, path } = this.cookieObj;
    this.cookie.delete(name, path);
  }

  /**
   * Random ads URL
   * @returns URL string
   */
  private async getRandomAds() {
    const adsArray = this.$ads.getValue();
    const data = adsArray[Math.floor(Math.random() * adsArray.length)];

    const singleAds = await this.fetchGetSingleAds();

    if (!singleAds) {
      return data;
    }

    // Update total ads count
    this.updateAds(singleAds.id);

    // Reset
    this.resetMax();

    // Return url
    // return data;
    return singleAds;
  }

  /**
   * Update ads count and assign the value to variable
   * @param id Ads id
   */
  private updateAds(id: TPayloadUpdateAds['id']) {
    // Get the value from variable
    const currentCountAds = this.$countAds.getValue();

    // Find and storing index to the variable
    const index = currentCountAds.findIndex((item) => item.id === id);

    // Found value in array, then increase play count
    if (index !== -1) {
      currentCountAds[index].play++;
    } else {
      // Not found, then add new ads id and default play count
      currentCountAds.push({ id, play: 1 });
    }

    // Assigning value to the variable
    this.$countAds.next(currentCountAds); // Creating a new array to trigger change detection
  }

  /**
   * Fetching API to get ads list.
   */
  public fetchGetAds() {
    // TODO PROD
    // return null;
    const url = webapi + '/ads/get_marketplace_sound';
    // const url =
    //   'https://seriously-super-vulture.ngrok-free.app/api/payment/get_ads';

    this.http
      .get<TAPIResponse<TResponseAds[]>>(url, this._auth.getHeader())
      .subscribe({
        next: (resp) => {
          if (resp) this.$ads.next(resp.data);
        },
        error: (err) => {
          console.warn(err);
          this.$ads.next([mock_a_TH]);
        },
      });
  }

  public fetchGetSingleAds(): Promise<TResponseAds> {
    const url = webapi + '/ads/get_ads';

    return new Promise((resolve, reject) => {
      this.http
        .get<TAPIResponse<TResponseAds>>(url, this._auth.getHeader())
        .subscribe({
          next: (resp) => {
            if (resp) {
              resolve(resp.data);
            }
          },
          error: (err) => {
            // console.warn(err);
            // reject(err);

            // Handle api failed
            resolve(mock_a_TH);
          },
        });
    });
  }

  public getSingleAdsNoToken(): Promise<TResponseAds> {
    const url = webapi + '/ads/get_ads_none_token';

    return new Promise((resolve, reject) => {
      this.http.get<TAPIResponse<TResponseAds>>(url).subscribe({
        next: (resp) => {
          if (resp) {
            resolve(resp.data);
          }
        },
        error: (err) => {
          console.warn(err);
          reject(err);
        },
      });
    });
  }

  /**
   * Fetching API to update ads.
   */
  public fetchUpdateAds() {
    // TODO PROD
    // return null;

    const countAds = this.$countAds.getValue();

    // Check existed value
    if (countAds.length <= 0) return;
    this.$countAds.next([]); // Reset the value

    // Prepare variable to fetch
    const url = webapi + '/ads/update_ads';
    const payload = { ads_play: countAds };

    // Fetching
    this.http.post(url, payload, this._auth.getHeader()).subscribe();
  }

  public getAllAds() {
    return this.$ads.getValue();
  }
}
