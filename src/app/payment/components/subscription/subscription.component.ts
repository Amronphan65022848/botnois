import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { SubscriptionAPIService } from '../../services/subscription-api.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { TAddonPackage } from '../../models/subscription-model';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs';
import { DialogPaidV2Component } from 'src/app/dialog/components/dialog-paid-v2/dialog-paid-v2.component';
import { UserData } from 'src/app/auth/models/auth-model';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { mock_subscription } from '../../mocks/subscription-mock';
import {
  Language,
  TBuyState,
  TypeCurrency,
} from 'src/app/shared/models/shared-model';
import { DialogUpsellComponent } from 'src/app/dialog/components/dialog-upsell/dialog-upsell.component';
import { WalletService } from '../../services/wallet.service';
import { analyticId } from 'src/app/shared/mocks/analyticId-mock';
registerLocaleData(localeTh); // Register thai-locale
type Pages = 'quote' | 'payment' | 'my_package';
type TLocale = 'th-TH' | 'en-US';
type TLanguage = {
  TH: TLocale;
  EN: TLocale;
};
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  user: UserData;
  text = language['TH'].subscriptionObj;
  text_dialog: any = null;
  text_wallet = null;
  text_conver = null;
  expiredTime = '';
  isAutoDebit = true;
  // advantages = [];
  isLoading = false;
  allPackageTier: TAddonPackage[] = [];
  addonOwnData: TAddonPackage[] = [];

  @Input() page: Pages = 'payment';
  @Output() _currentPackagePrice = new EventEmitter<number>();
  promotionExpire: string = '01-31-2024';

  analyticId = analyticId.payment.subscription;
  public lang: Language = 'TH';
  public currency: TypeCurrency;
  localeLanguage: TLanguage = {
    TH: 'th-TH',
    EN: 'en-US',
  };

  currentLocale: TLocale = null;

  public get buttonLabel(): string {
    return this.isMyPackage ? this.text.renew : this.text.tier.sign_up;
  }

  public get isMyPackage(): boolean {
    return this.page === 'my_package';
  }

  constructor(
    private _subAPI: SubscriptionAPIService,
    private _auth: AuthService,
    private _dialog: DialogService,
    private _gfunc: GlobalFunctionService,
    private dialog: MatDialog,
    private _language: ChangeLanguageService,
    private _unsub: UnsubscribeService,
    public _wallet: WalletService,
  ) {}

  ngOnInit(): void {
    // Get language and assign text
    this._language.language
      .pipe(takeUntil(this._unsub.$destroy))
      .subscribe((res) => {
        if (res) {
          this.lang = res;
          // this.currency = this._language.getCurrency()
          this.currency = this._language.setCurrencyBasedLanguage(res);
          this.currentLocale = this.localeLanguage[res];
          this.text = this._gfunc.deepclone(language[res].subscriptionObj);
          this.text_dialog = language[res].userObj.subscription;
          this.text_conver = language[res].text2speechObj.conver_mode;
          this.text_wallet =
            language[res].walletObj.alert.alert_success_package;
        }
      });

    if (this.page === 'quote') {
      this.allPackageTier = mock_subscription;
    } else {
      // Get user data
      this.isLoading = true;
      this._auth.data
        .pipe(
          filter((user) => !!user), // Existed value
          tap((user) => (this.user = user)), // Assign the value
          switchMap(() => this._subAPI.$package_addon), // Subscribe another observable
          filter((data) => !!data), // Existed data
          take(1),
        )
        .subscribe({
          next: (data) => {
            // Filtering storage package out of array
            this.allPackageTier = data;

            // Check if user has add-on package
            const addonOwn = this.user?.list_add_on;
            if (addonOwn) {
              for (let index = 0; index < addonOwn.length; index++) {
                const element = addonOwn[index];
                this.allPackageTier.forEach((packageData) => {
                  if (element.add_on === packageData.name) {
                    this.addonOwnData.push({
                      ...packageData,
                      exp: element.exp,
                    });
                  }
                });
              }
            }

            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
          },
        });
    }
  }

  /**
   * Get remaining days from expire package date.
   * @param exp
   * @returns remaining days
   */
  public getDaysLeft(exp: string) {
    const currentDate = new Date().getTime();
    const expDate = new Date(exp).getTime();
    const remainingDaysMs = expDate - currentDate;
    const days = Math.floor(remainingDaysMs / (1000 * 60 * 60 * 24));
    return days;
  }

  private openDialog(coin: any) {
    this.dialog.open(DialogPaidV2Component, {
      data: coin,
      autoFocus: true,
      disableClose: true,
      width: '400px',
    });
  }

  /** The function for user select the subscription package. */
  onChoose(data: TAddonPackage) {
    if (this.page === 'quote') {
      return this.dialog.open(FirebaseAuthComponent, {});
    }

    if (data.name === 'NoAds') {
      this.dialog
        .open(DialogUpsellComponent, {
          width: '566px',
          maxHeight: '90%',
          data: {
            noAds: data,
          },
          autoFocus: true,
          disableClose: true,
        })
        .afterClosed()
        .subscribe(
          (
            res: TBuyState & { item: { name?: string; package_id: string } },
          ) => {
            if (res) {
              let js = null;
              if (res?.item?.name) {
                const addon = res.item.name;
                const foundItem = this.allPackageTier.find(
                  (e) => e.name === addon,
                );
                js = this.formatData(foundItem);
              } else {
                const buypoint = this._wallet.$package.getValue();
                const foundItem = buypoint.find(
                  (e) => e.price_discount === res?.item?.price_discount,
                );
                js = this.formatData(foundItem as any);
              }

              return this.openDialog(js);
            } else {
              const js = this.formatData(data);
              return this.openDialog(js);
            }
          },
        );
    } else {
      const js = this.formatData(data);
      return this.openDialog(js);
    }
  }
  // TAddonPackage | TResponsePackage
  formatData(data: any) {
    let js = {
      point: data?.add_id ? data.display_name : data.point,
    };

    if (data?.qr_price) {
      // qr price from Lugent Pay
      js['price'] = data?.qr_price;
    } else {
      // Original price
      if (data?.price_discount) {
        js['price'] =
          this.currency === 'usd'
            ? data.us_price_discount
            : data.price_discount;
      } else {
        js['price'] = this.currency === 'usd' ? data.us_price : data.price;
      }
    }

    if (data?.add_id) {
      js['sub_data'] = data;
    }

    if (data?.package_id) {
      js['addon'] = {
        add_on: 'NoAds',
        add_on_day: 1,
      };
    }

    // js['sub_data'] = data
    return js;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.text = null;
    this._unsub.complete();
  }
}
