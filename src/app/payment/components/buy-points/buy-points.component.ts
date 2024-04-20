import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { WalletService } from '../../services/wallet.service';
import { CookieService } from 'ngx-cookie-service';

import { DialogPaidV2Component } from 'src/app/dialog/components/dialog-paid-v2/dialog-paid-v2.component';
import {
  ChangeNavbarData,
  TAddOn,
  TResponsePackage,
} from '../../models/wallet-model';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';
import { UserData } from 'src/app/auth/models/auth-model';
import { SubscriptionPackage } from '../../models/subscription-model';
import { mockupPackage } from '../../mocks/buy-point-mock';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { Language, TypeCurrency } from 'src/app/shared/models/shared-model';
import { analyticId } from 'src/app/shared/mocks/analyticId-mock';
type Pages = 'quote' | 'payment';
type Coin = {
  point: number | string;
  bonus?: number;
  price: number;
  type?: 'input' | 'mini';
  sub_data?: any;
  addon?: TAddOn;
};

@Component({
  selector: 'app-buy-points',
  templateUrl: './buy-points.component.html',
  styleUrls: ['./buy-points.component.scss'],
})
export class BuyPointsComponent implements OnInit {
  package: TResponsePackage[] = [];

  pointLoading: boolean = false;

  public pointForm = new FormControl<number>(4000);
  get price(): number {
    const point = this.pointForm.value;
    if (point < 0) {
      return 0;
    } else {
      const divider = this.currency === 'usd' ? 1000 : 40;
      const decimal = this.currency === 'usd' ? 2 : 0;
      return Number((point / divider).toFixed(decimal));
    }
  }
  // text = null;
  text = language['TH'].walletObj.buy_points;

  userPackageData: SubscriptionPackage[] = null;
  analyticId = analyticId.payment.buyPoint;
  @Input() user: UserData;
  @Input() page: Pages = 'payment' || 'quote';

  @Output() _changeNav = new EventEmitter<ChangeNavbarData>(null);

  priceByInputPoint = 0;
  allPackage: SubscriptionPackage[] = [];
  currentType = 2; // min 1 , max 4
  countdown: number = 0; // count of discount time
  isLoadPackage = false;
  isDiscount = false;
  $interval: Subscription;
  $destroy = new Subject();
  timeleft: number;
  cookieName = '_bn_countdowntime';
  lang: Language;
  currency: TypeCurrency = 'usd';
  isUnlimited: boolean = false;
  constructor(
    private dialog: MatDialog,
    public _wallet: WalletService,
    private _language: ChangeLanguageService,
    private _unsub: UnsubscribeService,
    private cookie: CookieService,
  ) {}

  ngOnInit(): void {
    // Get language
    this._language.language
      .pipe(takeUntil(this._unsub.$destroy))
      .subscribe((resp) => {
        this.lang = resp;
        this.text = language[resp].walletObj.buy_points;
        this.currency = this._language.setCurrencyBasedLanguage(resp);
      });

    if (this.page === 'quote') {
      this.package = mockupPackage;
    } else {
      // Get buy points packages
      this._wallet.$package.subscribe((res) => {
        this.isLoadPackage = false;
        this.package = res;
      });
    }

    // Check if a countdown cookie exists
    if (this.getCookie() == null) {
      this.setCookie();
    }
    this.checkCountdown();
  }

  // Check if the countdown is still active
  checkCountdown() {
    let timeout = this.getCookie();
    const currenttime = new Date().getTime();
    if (timeout > currenttime) {
      // Activate discount and start the countdown
      this.isDiscount = true;
      this.onCountdown(timeout, currenttime);
    }
  }

  getCookie() {
    // Get the countdown time from the cookie
    const cookieValue = this.cookie.get(this.cookieName);
    return cookieValue ? parseInt(cookieValue, 10) : null;
  }
  setCookie() {
    // Set a new countdown time in the cookie (15 minutes)
    this.countdown = new Date().getTime() + 15 * 60 * 1000;
    const expiresAt = new Date(Date.now() + 16 * 60 * 1000);
    // TODO check expire cookie
    this.cookie.set(this.cookieName, this.countdown.toString(), expiresAt, '/');
  }
  resetCookie() {
    // Reset the countdown cookie
    this.cookie.delete(this.cookieName, '/');
  }
  /**
   * Count down the number to zero.
   */
  onCountdown(timeout: number, currenttime: number) {
    // Calculate the remaining time
    this.timeleft = Math.max(0, timeout - currenttime);
    this.$interval = interval(1000) // Emit every second
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        // Update the timeleft for each interval
        this.timeleft -= 1000;
        if (this.timeleft <= 0) {
          // Countdown reached zero, deactivate discount
          this.isDiscount = false;

          // Complete and unsubscribe from the observable
          this.$destroy.complete();
          this.$interval.unsubscribe();
        }
      });
  }
  onToggle(index: number) {
    this.currentType = index;
  }

  dayToMonth(days: number) {
    return Math.ceil(days / 31);
  }

  toCompanyDocs() {
    const url =
      'https://docs.google.com/document/d/1v2lmehMG6Jie8WrbnfGCf4Wa-odwN26VxATnwm4_qT4/edit';
    window.open(url, '_blank');
  }
  toCompanyForms() {
    const url =
      'https://forms.gle/uLT2DoXZArLYduLb8';
    window.open(url, '_blank');
  }

  /**
   * Condition to display discount countdown
   */
  displayDiscount(item: TResponsePackage) {
    return this._wallet.displayDiscountPriceByCurrency(item) && this.isDiscount;
  }

  topup() {
    /* less vars */
    const point = this.pointForm.value;
    // const baht = this.price

    /* assign point to baht with calculatd function */
    // baht.patchValue(this.priceByInputPoint);

    /* mock js */
    const js: Coin = { price: this.price, point: point };

    /* trigger top up when baht greater than 0 */
    if (this.price <= 0) return;
    else {
      this.openDialog(js);
    }
  }

  handlePurchase(item: TResponsePackage) {
    if (this.page === 'quote') return this.dialog.open(FirebaseAuthComponent);
    const {
      us_price_discount,
      price_discount,
      us_price,
      price,
      point,
      package_id,
      sub_id,
      url,
      us_url,
      add_on,
      add_on_day,
    } = item;
    const addon = { add_on, add_on_day: this.dayToMonth(add_on_day) };
    if (item.price_discount && this.isDiscount && item.type < 4) {
      const price =
        this.currency === 'usd' ? us_price_discount : price_discount;
      this.openDialog({ price, point, addon });
    } else {
      let obj: Coin = {
        price: this.currency === 'usd' ? us_price : price,
        point,
      };
      // If Unlimited
      if (item.type === 4) {
        obj['sub_data'] = item;

        obj['point'] = package_id;
      }

      if (add_on && add_on_day) {
        obj = {
          ...obj,
          addon,
        };
      }
      this.openDialog(obj);
    }
  }

  openDialog(coin: Coin) {
    this.dialog.open(DialogPaidV2Component, {
      data: coin,
      autoFocus: true,
      disableClose: true,
    });
  }

  private delayPointLoading() {
    this.pointLoading = true;

    setTimeout(() => {
      this.pointLoading = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    this._unsub.complete();
    //this._wallet.$countdown.next(this.countdown);
    this.$destroy.next(this.onCountdown);
  }

  openUnlimited(){
    this.isUnlimited = true
  }
  closeUnlimited() {
    this.isUnlimited = false
  }
}
