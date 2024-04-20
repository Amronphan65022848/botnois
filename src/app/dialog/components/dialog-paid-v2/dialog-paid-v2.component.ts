import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { DialogService } from '../../services/dialog.service';
import {
  Language,
  TPayMethods,
  TState,
  TypeCurrency,
} from 'src/app/shared/models/shared-model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
import { SubscriptionPackage } from 'src/app/payment/models/subscription-model';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  PromptPayData,
  TAddOn,
  TDialogPaidData,
} from 'src/app/payment/models/wallet-model';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';
import { CookieService } from 'ngx-cookie-service';
import { analyticId } from 'src/app/shared/mocks/analyticId-mock';
@Component({
  selector: 'app-dialog-paid-v2',
  templateUrl: './dialog-paid-v2.component.html',
  styleUrls: ['./dialog-paid-v2.component.scss'],
})
export class DialogPaidV2Component implements OnInit {
  public sellerCode = null;
  isLoading: boolean = false;
  isCodeCheck: boolean = false;
  isCodeFetchingValidate: boolean = false;
  isCodeValid: boolean = null;
  isPackage: boolean = null;
  showClearCode: boolean = false;
  showHotPromotion: boolean = false;
  isHotPromotion: boolean = true;

  price: number = 0;
  point: number = null;
  bonus: number = 0;
  fee: number = 0;
  total: number = 0;
  istotalPoint: number = 0;
  type: number = null;
  day: number = null;
  package_name: string = null;
  month: number = null;
  name: any = null;
  hotpromotion: number = 0;
  hotpromotionprice: number = 0;

  text = language['TH'].dialogPaid;
  code = new FormControl<any>('');
  method: TPayMethods = 'promptpay';
  currency: TypeCurrency = 'thb';
  step: number = 1;

  qr: string;
  transactionId: string;
  IntervalCheckPaidSuccess: any;

  sub_data: SubscriptionPackage = null;
  addon: TAddOn = null;
  isFee = true;
  isLugent = false;
  salesCodeBonusRate = 0;
  lang: Language;
  data: TDialogPaidData & { sub_data: SubscriptionPackage };
  email = new FormControl<any>(null, [Validators.required, Validators.email]);
  isRecurring = false; // recurring payment on credit card
  analyticId = analyticId.payment.dialogPaid;
  constructor(
    public dialogRef: MatDialogRef<DialogPaidV2Component, TState>,
    @Inject(MAT_DIALOG_DATA)
    data: TDialogPaidData & { sub_data: SubscriptionPackage },
    private _language: ChangeLanguageService,
    private _wallet: WalletService,
    private _dialog: DialogService,
    private _auth: AuthService,
    private dialog: MatDialog,
    private _subAPI: SubscriptionAPIService,
    private _notify: NotificationService,
    public cookie: CookieService,
  ) {
    this.data = data;
  }

  ngOnInit(): void {
    this.getSaleCode();

    this._language.language.subscribe((resp) => {
      this.lang = resp;
      // this.currency = this._language.getCurrency()
      this.currency = this._language.setCurrencyBasedLanguage(resp);
      this.text = language[resp].dialogPaid;
      this.setHotPromotion();
      if (this.currency === 'usd') {
        this.method = 'card';
      }
    });

    this._notify.notifyJson.subscribe((resp) => {
      if (resp) {
        this.isLugent = resp?.payment?.lugent;
      }
    });

    this.formatData();
  }

  upsize5k = [4100, 12500, 23500];
  upsize10k = [42000, 71000];
  upsize18k = [97500];
  upsize95k = [200000, 430000];
  upsize120k = [1000000];
  setHotPromotion() {
    // thb -------------------------------------------------------------------------
    if (this.currency === 'thb' && this.upsize5k.includes(this.data.point)) {
      this.hotpromotion = 5000;
      this.hotpromotionprice = 60;
    }
    if (this.currency === 'thb' && this.upsize10k.includes(this.data.point)) {
      this.hotpromotion = 10000;
      this.hotpromotionprice = 120;
    }
    if (this.currency === 'thb' && this.upsize18k.includes(this.data.point)) {
      this.hotpromotion = 18000;
      this.hotpromotionprice = 199;
    }
    if (this.currency === 'thb' && this.upsize95k.includes(this.data.point)) {
      this.hotpromotion = 95000;
      this.hotpromotionprice = 1000;
    }
    if (this.currency === 'thb' && this.upsize120k.includes(this.data.point)) {
      this.hotpromotion = 120000;
      this.hotpromotionprice = 1000;
    }
    // usd ------------------------------------------------------------------------

    if (this.currency === 'usd' && this.upsize5k.includes(this.data.point)) {
      this.hotpromotion = 5000;
      this.hotpromotionprice = 1.99;
    }
    if (this.currency === 'usd' && this.upsize10k.includes(this.data.point)) {
      this.hotpromotion = 10000;
      this.hotpromotionprice = 3.99;
    }
    if (this.currency === 'usd' && this.upsize18k.includes(this.data.point)) {
      this.hotpromotion = 18000;
      this.hotpromotionprice = 5.99;
    }
    if (this.currency === 'usd' && this.upsize95k.includes(this.data.point)) {
      this.hotpromotion = 95000;
      this.hotpromotionprice = 29.99;
    }
    if (this.currency === 'usd' && this.upsize120k.includes(this.data.point)) {
      this.hotpromotion = 120000;
      this.hotpromotionprice = 29.99;
    }
  }

  /** Format data from dialog input */
  formatData() {
    const data = this.data;
    this.price = data?.price;
    this.point = data?.point;
    this.type = data?.sub_data?.type;
    this.day = data?.sub_data?.day;
    this.package_name = data?.sub_data?.display_name;
    this.name = data.sub_data?.name;
    if (data?.type === 'qr') {
      this.intervalCheckQR(data.qrData);
    }
    // else if (data?.type === 'input') {
    //   this.isLugent = true;
    // }
    else if (data?.bonus) {
      this.bonus = data.bonus;
      this.isPackage = false;
    } else if (data?.sub_data) {
      this.sub_data = data.sub_data;
      this.isPackage = true;

      if (!this.sub_data?.type) {
        this.isRecurring = true;
      }

      if (!this.sub_data?.qr_price) {
        this.isFee = false;
      }

      if (this.sub_data.price < 100) {
        this.isFee = true;
      }
      if (this.sub_data?.price_discount >= 0) {
        this.price =
          this.currency === 'usd'
            ? this.sub_data.us_price_discount
            : this.sub_data.price_discount;
      }
    }

    if (data?.addon) {
      this.addon = data.addon;
    }
  }

  /**
   * Display pay methods by current language
   */
  public displayMethodByLang(item: any[]): any[] {
    return this.currency === 'usd' ? [item[1]] : item;
  }

  private setCookie(name: string, value: any) {
    this.cookie.set(name, value, 1, '/');
  }

  private deleteCookie(name: string): void {
    this.cookie.delete(name, '/');
  }

  // Selecting payment method
  public onSelectMethod(method: string) {
    if (method === 'card' && this.sub_data?.subscription_rank === 'Mini')
      return;
    this.method = method as TPayMethods;
  }

  // Purchase
  public onPurchase(method: TPayMethods) {
    this.isLoading = true;
    let price = this.addFee(this.price);
    // const code: string = String(this.code.value).toLowerCase();

    // let depa = null;
    // if (this._auth.data.getValue()?.depa) {
    //   depa = String(this._auth.data.getValue()?.depa).toLowerCase();
    // }

    const sub_data = this.sub_data;

    if (sub_data) {
      price = sub_data.price_discount ?? price;
    }
    this.saveCookie();
    // Check exist subscription data
    if (this.sub_data) {
      // Handle subscription data
      if (this.isLugent && method === 'promptpay') {
        // Handle Lugent subscription
        this.lugentSubscription();
      } else {
        // Handle Stripe subscription
        this.stripSubscription(method);
      }
    } else if (
      (price < 10 && this.lang === 'TH') ||
      (method === 'promptpay' && this.isLugent)
    ) {
      // Handle payment for cases where price is less than 10 or method is 'promptpay' and isLugent is true
      this.LugentPay();
    } else {
      // Handle all other cases
      this.toStripe(method);
    }
  }

  private saveCookie() {
    this.deleteCookie('_bn_package_point');
    this.deleteCookie('_bn_package_add_on_day');
    this.deleteCookie('_bn_package_type');
    this.deleteCookie('_bn_package_name');
    if (this.type !== 4 && !this.name) {
      this.setCookie('_bn_package_point', this.calPoint());
    }
    if (this.name) {
      this.setCookie('_bn_package_name', this.package_name);
      this.setCookie('_bn_package_add_on_day', this.day);
    }
    if (this.addon) {
      this.setCookie('_bn_package_add_on_day', this.addon.add_on_day);
    }
    if (this.type === 4) {
      this.setCookie('_bn_package_type', this.type);
      this.setCookie('_bn_package_add_on_day', this.day);
    }
  }

  private toStripe(method: TPayMethods) {
    // Prepare JSON
    let temp = {
      price: this.addFee(this.price),
      currency: this.currency,
      method: [method],
    };

    // User enter salescode
    const code: string = this.code.value;
    if (code.length > 0) {
      const codename = code.toLowerCase();
      temp['sales'] = codename;
    }

    return this.customePrice(temp);
  }

  /** Flexible API can request any price is greate than 10 */
  private customePrice(data, codename?: string) {
    this._wallet.customPrice(data).subscribe({
      next: (res) => {
        let url = res.data;
        if (res) {
          if (codename?.length > 0) url = url + '_sid_' + codename;
          this.isLoading = false;
          window.location.href = url;
        } else {
          this._dialog.warning(url);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  private lugentSubscription() {
    const data = this.sub_data;
    this._subAPI.getSubscriptionPromptpayLugent(data.add_id).subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.intervalCheckQR(resp, true);
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  private stripSubscription(method: TPayMethods) {
    const data = this.sub_data;
    const { user_id, email } = this._auth.getUserData();
    const code: string = this.code.value;
    if (data?.add_id) {
      // Add-on packages

      this._subAPI
        .getAddonSubscription(data.add_id, method, this.currency)
        .subscribe({
          next: (res) => {
            if (res) {
              // Nevigate user to promptpay method url
              const url = res.data;
              window.location.href = url;
            }
          },
          error: (err) => {
            this.isLoading = false;
            this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
          },
        });
    } else {
      // Unlimited
      if (method == 'card') {
        this.isLoading = false;

        let url = this.currency === 'usd' ? data.us_url : data.url;
        url += `?client_reference_id=${user_id}_sub_${data.sub_id}`; // Add user_id for tracking
        // Existed salse code name
        if (code) {
          url += '_sid_' + code;
        }
        // Discount coupon
        if (data?.coupon) {
          const coupon = this.currency === 'usd' ? data.us_coupon : data.coupon;
          url += '&prefilled_promo_code=' + coupon;
        }

        // Assign email to FormControl variable
        this.email.setValue(email);

        // Check if the email is valid
        if (this.email.valid) {
          // Prefilled email
          url += '&prefilled_email=' + this.email.value;
        }
        // Navigate user to subscription credit-card method url
        window.location.href = url;
      } else {
        // Fetching API for navigate user to stripe promptpay
        this._subAPI
          .getSubscriptionPromptpay(
            data.sub_id,
            code,
            data?.coupon ? true : false,
          )
          .subscribe({
            next: (res) => {
              if (res) window.location.href = res.data; // Nevigate user to promptpay method url
            },
            error: (err) => {
              this.isLoading = false;
              this._dialog.error(
                err.error.message ?? JSON.stringify(err?.error),
              );
            },
          });
      }
    }

    this.isLoading = false;
  }

  private LugentPay() {
    let js!: any;
    const codename = String(this.code.value).replace(' ', '');

    js = {
      baht: this.price,
      point: this.point,
    };

    if (codename.length > 0) {
      js.sale_code_name = codename;
    }

    // Add bonus
    js['point'] += this.bonus;

    this._wallet.topupByUserInput(js).subscribe({
      next: (resp) => {
        if (resp['message'] == 'Can not find sale_code_name') {
          this.step = 1;
          // this.code.reset();
          return this._dialog.error('Referral Codename ไม่มีอยู่ในระบบ');
        }
        // Storing qrcode to session storage for call it next time
        const { qrCode, transactionId } = resp.data;
        localStorage.setItem(
          'qrData',
          JSON.stringify({ qrCode, transactionId, price: this.price }),
        );

        this.intervalCheckQR(resp.data);
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  /**
   * Interval fetching to check qrcode API for receive success transaction status
   * @param data Payment data
   * @param isSubscription Check state between subscription or buy points
   */
  private intervalCheckQR(
    data: TDialogPaidData['qrData'],
    isSubscription = false,
  ) {
    this.isLoading = false;
    /* next step */
    this.step = 2;
    this.qr = data.qrCode;
    this.transactionId = data.transactionId;

    this.IntervalCheckPaidSuccess = setInterval(() => {
      //ถ้าอยู่ใน panel สแกน QR Code
      if (this.step === 2) {
        if (this.transactionId == '') {
          return;
        }

        this._wallet
          .postCheckPaidSuccess(this.transactionId, isSubscription)
          .subscribe(async (data: any) => {
            //ถ้าชำระเงินสำเร็จแล้ว
            if (data.data.status) {
              //get profile ล่าสุด เพื่ออัพเดตเครดิต
              this._auth.getUpdateUser();
              localStorage.removeItem('qrData');
              clearInterval(this.IntervalCheckPaidSuccess);

              //ปิด dialog QR Code
              this.dialogRef.close('Downloading');

              //เปิด dialog ชำระเงินสำเร็จ
              this.openDialogSuccess('0');
              return;
            }
          });
      }
    }, 3000);
  }

  private openDialogSuccess(sum: String) {
    this._auth.getUpdateUser();

    const dialogsuccess = this.dialog.open(DialogSuccessComponent, {
      data: sum,
      width: '350px',

      // autoFocus: false,
      // panelClass: 'full-width-dialog',
    });
  }
  // Add credit card fee to price
  public addFee(price: number) {
    if (this.method == 'card' && this.isFee && this.currency === 'thb') {
      return Number(price) + 10;
    }
    return price;
  }

  public upSize(price: number) {
    if (this.showHotPromotion && this.isHotPromotion && this.lang === 'TH') {
      return Number(price) + this.hotpromotionprice;
    }
    if (this.showHotPromotion && this.isHotPromotion && this.lang === 'EN') {
      return Number(price) + this.hotpromotionprice;
    }
    return price;
  }
  public addFeeAndUpSize(price: number) {
    if (
      this.method == 'card' &&
      this.isFee &&
      this.showHotPromotion &&
      this.isHotPromotion &&
      this.lang === 'TH'
    ) {
      return Number(price) + this.hotpromotionprice + 10;
    }
    if (
      this.method == 'card' &&
      this.isFee &&
      this.showHotPromotion &&
      this.isHotPromotion &&
      this.lang === 'EN'
    ) {
      return Number(price) + this.hotpromotionprice;
    }
    return price;
  }

  public calPrice(price: number) {
    if (
      this.method == 'card' &&
      this.isFee &&
      this.showHotPromotion &&
      this.isHotPromotion
    ) {
      return this.addFeeAndUpSize(price);
    }
    if (this.method == 'card' && this.isFee) {
      return this.addFee(price);
    }
    if (this.showHotPromotion && this.isHotPromotion) {
      return this.upSize(price);
    }
    return price;
  }

  // Calculate total received point
  public calPoint(): number {
    if (typeof this.point === 'number') {
      let totalPoint = 0;
      if (this.bonus) {
        totalPoint = this.point + this.bonus;
        this.istotalPoint = totalPoint;
      }
      if (this.showHotPromotion && this.isHotPromotion) {
        totalPoint = this.point + this.hotpromotion;
        this.istotalPoint = totalPoint;
      } else {
        totalPoint = this.point;
        this.istotalPoint = totalPoint;
      }

      // add 20% point
      if (this.isCodeValid) {
        totalPoint = totalPoint * (1 + this.salesCodeBonusRate);
        this.istotalPoint = totalPoint;
      }

      return totalPoint;
    } else {
      return 0;
    }
  }

  // Calculate total received bonus point
  public calSalesBonus(): number {
    let totalPoints = 0;
    if (typeof this.point === 'number') {
      totalPoints = (this.point + this.bonus) * this.salesCodeBonusRate;
    } else if (this.sub_data) {
      let { monthly_point, month } = this.sub_data;

      // Prevent daily (0 month) case
      if (month <= 0) month = 1;

      // Finalize
      totalPoints = monthly_point * month * this.salesCodeBonusRate;
    }

    return totalPoints;
  }

  private checkSalesCode(codeName: string): void {
    this.isCodeFetchingValidate = true;
    this._wallet.checkSaleCodeName(codeName.toLowerCase()).subscribe({
      next: (resp) => {
        this.isCodeFetchingValidate = false;
        if (resp.message !== true) {
          // this.code.reset(); // Reset to NULL when code is not sales
          this.isCodeValid = false;
        } else {
          this.isCodeValid = true;
          this.salesCodeBonusRate = resp?.percent;
          //points increase 20%
        }
      },
      error: (err) => {
        this.isCodeFetchingValidate = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  public toggleCodeCheck() {
    if (this.isCodeCheck === false) {
      this.isCodeCheck = true;
    } else {
      this.isCodeCheck = false;
      this.toggleClearCode();
    }
  }

  public close() {
    this.dialogRef.close('Canceled');
    this.bonus = 0;
  }

  public onConfirmCode() {
    this.checkSalesCode(this.code.value);
    this.showClearCode = true;
  }
  public toggleClearCode() {
    this.salesCodeBonusRate = 0;
    this.code.reset();
    this.showClearCode = false;
    this.isCodeValid = null;
  }
  public resetValid() {
    this.isCodeValid = null;
    // if (!this.code.value) {
    this.showClearCode = false;
    // }
  }
  public toggleShowHotPromotion() {
    if (this.showHotPromotion === false) {
      this.showHotPromotion = true;
      this.isHotPromotion = true;
    } else {
      this.showHotPromotion = false;
    }
  }
  public toggleHotPromotion() {
    if (this.isHotPromotion === false) {
      this.isHotPromotion = true;
    } else {
      this.isHotPromotion = false;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.IntervalCheckPaidSuccess);
  }

  private getSaleCode() {
    if (
      this.data?.sub_data?.type !== 4 &&
      this.data?.sub_data?.display_name !== 'No Ads' &&
      this.data?.sub_data?.display_name !== 'More Text'
    ) {
      setTimeout(() => {
        this.sellerCode = sessionStorage.getItem('_bn_seller_code');
        if (this.sellerCode && this.code) {
          this.code.setValue(this.sellerCode);
          this.onConfirmCode();
          this.isCodeCheck = true;
        }
      }, 0);
    }
  }
}
