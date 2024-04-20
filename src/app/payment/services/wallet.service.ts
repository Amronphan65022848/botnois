import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const { webapi } = environment;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from '../../dialog/services/dialog.service';
import {
  CustomPrice,
  PromptPayData,
  QRCodeResponse,
  TDialogPaidData,
  TResponsePackage,
  TopUpByUserInput,
} from '../models/wallet-model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPaidV2Component } from 'src/app/dialog/components/dialog-paid-v2/dialog-paid-v2.component';
import {
  Language,
  TAPIResponse,
  TState,
  TypeCurrency,
} from 'src/app/shared/models/shared-model';
import { Observable } from 'rxjs';
import { TPayloadUpdateAds } from '../models/ads-model';
import { UserData } from 'src/app/auth/models/auth-model';
import { SubscriptionPackage } from '../models/subscription-model';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

type TPrice = {
  us_price?: number;
  price?: number;
  us_price_discount?: number;
  price_discount?: number;
};
@Injectable({
  providedIn: 'root',
})
export class WalletService {
  $package = new BehaviorSubject<TResponsePackage[]>([]);
  $countdown = new BehaviorSubject<number>(null);
  $countdown5min = new BehaviorSubject<number>(null);
  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _dialog: DialogService,
    private dialog: MatDialog,
    private _language: ChangeLanguageService,
  ) {}

  openDialogPaid(data: TDialogPaidData) {
    return new Observable<TState>((sub) => {
      const dialogRef = this.dialog.open(DialogPaidV2Component, {
        disableClose: true,
        data,
      });

      dialogRef.afterClosed().subscribe((resp: TState) => {
        // Remove localStorage item if 'Canceled'
        if (resp === 'Canceled') {
          localStorage.removeItem('qrData');
        }

        // Emit the response and complete the observable
        sub.next(resp);
        sub.complete();
      });
    });
  }

  customPrice(js: CustomPrice) {
    const token = 'Bearer ' + this._auth.getToken();
    const header = new HttpHeaders({
      Authorization: `${token}`,
    });

    const url = webapi + '/stripe/custom_price';
    return this.http.post<TAPIResponse<string>>(url, js, { headers: header });
  }

  postWallet(js: any) {
    const token = 'Bearer ' + this._auth.getToken();
    const header = new HttpHeaders({
      Authorization: `${token}`,
    });

    const body = js;

    const url = webapi + '/payment/register_qrcode';
    return this.http.post(url, body, { headers: header });
  }

  checkSaleCodeName(codename: string) {
    const token = 'Bearer ' + this._auth.getToken();
    const header = new HttpHeaders({
      Authorization: `${token}`,
    });

    const body = {
      sale_code_name: codename,
    };

    const url = webapi + '/payment/check_sale_code_name';
    return this.http.post<any>(url, body, { headers: header });
  }

  getAllpackage() {
    const token = 'Bearer ' + this._auth.getToken();
    const header = new HttpHeaders({
      Authorization: `${token}`,
      'ngrok-skip-browser-warning': '564',
    });
    // const url = "https://seriously-super-vulture.ngrok-free.app/api/payment/package"
    const url = webapi + '/payment/v2/get_all_package';
    return this.http.get<TAPIResponse<any[]>>(url, { headers: header });
  }

  // use when user not enought points
  getpointLess(text: any) {
    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: `${token}`,
    });

    const textSend = {
      text: text,
    };

    const url = webapi + '/payment/register_text_qrcode';
    return this.http.post(url, textSend, { headers: header });
  }

  // user enter point < 10 thb
  topupByUserInput(js: TopUpByUserInput) {
    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: `${token}`,
    });

    const url = webapi + '/payment/register_baht_qrcode';
    return this.http.post<QRCodeResponse>(url, js, { headers: header });
  }

  postCheckPaidSuccess(transactionId: String, isSubscription = false) {
    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: `${token}`,
    });

    const bodycheck = {
      transactionId: transactionId,
    };

    let url =
      webapi +
      '/payment/' +
      (isSubscription ? 'check_qrcode_subscription' : 'check_qrcode');
    return this.http.post(url, bodycheck, { headers: header });
  }

  coupon(Text: string) {
    const body = { coupon_name: Text };
    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: `${token}`,
    });
    const url = webapi + '/payment/check_coupon';
    return this.http.post<TAPIResponse<{ sum: number; status_coupon: string }>>(
      url,
      body,
      { headers: header },
    );
  }

  /**
   * Format point based on subscription rank
   * @param point
   * @returns
   */
  public formatPoint(
    item: TResponsePackage[],
    user: UserData,
    allPackage: SubscriptionPackage[],
  ) {
    const { subscription } = user;
    if (subscription === 'Free') return item;
    else {
      const { point_per_thb } = allPackage.find(
        (e) => e.subscription_rank === subscription,
      );
      item.forEach(
        (e, i) => (item[i].point = Math.floor((e.point / 40) * point_per_thb)),
      );
      return item;
    }
  }

  public getPackage() {
    if (this.$package.getValue().length == 0) {
      // this.isLoadPackage = true;
      this.getAllpackage().subscribe({
        next: (res) => {
          const _package = res.data;
          this.$package.next(_package);
          return _package;
        },
        error: (err) => {},
      });
    } else {
      const _package = this.$package.getValue();
      return _package;
    }
  }

  /**
   * Display between THB or USD price based on current language
   */
  public displayPriceByCurrency(item: TPrice) {
    const lang = this._language.getLanguage();
    const currency = this._language.setCurrencyBasedLanguage(lang);
    return currency === 'usd' ? item?.us_price : item?.price;
  }

  /**
   * Display between THB or USD discount price based on current currencyuage
   */
  public displayDiscountPriceByCurrency(item: TPrice) {
    const lang = this._language.getLanguage();
    const currency = this._language.setCurrencyBasedLanguage(lang);
    return currency === 'usd' ? item?.us_price_discount : item?.price_discount;
  }

  /**
   * Convert THB price to USD.
   * @param number
   * @returns
   */
  public convertPriceByCurrency(number: number | string, isMinusOne?: boolean) {
    // Get data from variables
    const lang = this._language.getLanguage();
    const currency = this._language.setCurrencyBasedLanguage(lang);

    // Set convert values on variables
    let convertedPoint = number;
    const currencyFormat = this.getCurrencyByLanguage(lang, currency);

    // If usd currency
    if (currency === 'usd') {
      // Converting price
      let usd: number | string = Number(number) / 33;

      // For price like x.99 USD
      if (isMinusOne) usd -= 0.01;

      // Add decimal and assign to temp variable
      convertedPoint = usd.toFixed(2);
    }

    return `${convertedPoint} ${currencyFormat}`;
  }

  /**
   * Convert points to price by currency and language conditions.
   * @param number
   * @returns
   */
  public convertPointByCurrency(point: number | string) {
    // Point should be number type
    if (typeof point === 'string') return;

    // Get data from variables
    const lang = this._language.getLanguage();
    const currency = this._language.setCurrencyBasedLanguage(lang);

    // Set convert values on variables
    const rate = currency === 'usd' ? 1333 : 40;
    const decimal = currency === 'usd' ? 3 : 2;

    // Converting point to price
    const convertedPoint =
      point < 0 ? 0 : Number(point / rate).toFixed(decimal);
    const currencyFormat = this.getCurrencyByLanguage(lang, currency);
    return `${convertedPoint} ${currencyFormat}`;
  }

  /**
   * Specific display by currency and language conditions.
   * @param lang
   * @param currency
   * @returns
   */
  getCurrencyByLanguage(lang: Language, currency: TypeCurrency) {
    return lang === 'EN' ? 'USD' : 'บาท';

    // if (currency === 'usd') {
    //   return 'USD'
    // } else {
    //   return lang === 'EN' ? 'THB' : 'บาท'
    // }
  }

  // Get Prompt pay qrcode by Stripe
  // getStripePromptPay(data:CustomPrice){
  //   const header = new HttpHeaders({
  //     Authorization: 'Bearer ' + this._auth.getToken()
  //   });
  //   const url = webapi + '/payment/create_promptpay_stripe';
  //   return this.http.post<any>(url, data, { headers: header });
  // }
}
