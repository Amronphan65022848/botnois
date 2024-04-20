import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Subject,
  Subscription,
  debounceTime,
  filter,
  interval,
  take,
  takeUntil,
} from 'rxjs';
import { TAddonPackage } from 'src/app/payment/models/subscription-model';
import { TResponsePackage } from 'src/app/payment/models/wallet-model';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { language } from 'src/app/shared/change_language/language';
import { analyticId } from 'src/app/shared/mocks/analyticId-mock';
import {
  Language,
  TBuyState,
  TypeCurrency,
} from 'src/app/shared/models/shared-model';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';

type TAnalyticData = {
  item_on_dialog: string[];
  close: string;
  addon_on_subscription?: string[];
  inputPoint?: {
    input: string;
    btn: string;
  };
  seemore?: string;
};

type TData = {
  paidPoint?: number;
  noAds?: TAddonPackage;
};
@Component({
  selector: 'app-dialog-upsell',
  templateUrl: './dialog-upsell.component.html',
  styleUrls: ['./dialog-upsell.component.scss'],
})
export class DialogUpsellComponent implements OnInit {
  public text = language['TH'].upsell;
  public promotePackage: TResponsePackage[] = null;
  public countdown = 0;
  public data: TData = null;
  public isDiscount = false;
  public currentSelect: number = 0;
  private $interval: Subscription;
  private $destroy = new Subject();
  public currency: TypeCurrency;
  public pointForm = new FormControl<number>(4000);
  get price() {
    const point = this.pointForm.value;
    if (point < 0) {
      return 0;
    } else {
      const divider = this.currency === 'usd' ? 1000 : 40;
      const decimal = this.currency === 'usd' ? 2 : 0;
      return Number((point / divider).toFixed(decimal));
    }
  }

  analyticId: TAnalyticData = analyticId.payment.downloadNoPoint;

  constructor(
    private dialogRef: MatDialogRef<DialogUpsellComponent, TBuyState>,
    private _changeLanguage: ChangeLanguageService,
    public _wallet: WalletService,
    private _gfunc: GlobalFunctionService,
    @Inject(MAT_DIALOG_DATA) private _data: TData,
  ) {
    this.data = this._data;
  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].upsell;
        // this.currency = this._changeLanguage.getCurrency()
        this.currency = this._changeLanguage.setCurrencyBasedLanguage(res);
      }
    });

    this._wallet.$package
      .pipe(
        filter((res) => !!res && res.length > 0),
        take(1),
      )
      .subscribe((res) => {
        // Find and select one package to display on promote
        let foundItem = res
          .filter((e) => {
            if (this.data.noAds) {
              return e.price_discount === 200;
            } else {
              return e.price_discount === 200 || e.price_discount === 349;
              // || e.price_discount === 1300 || e.price_discount === 4999
            }
          })
          .sort((a, b) => a.price_discount - b.price_discount);

        if (this.data.noAds) {
          // If no ads upsell then use subscription analytic
          this.analyticId = analyticId.payment.subscription;

          // Formatting values
          let temp = [];
          let noAds = this.data.noAds;
          noAds.point = 'No Ads' as any;
          temp[0] = foundItem[0];
          temp[1] = noAds;
          foundItem = temp;
        }

        // Deepclone var for avoid original data changed
        this.promotePackage = this._gfunc.deepclone(foundItem);
      });

    this._wallet.$countdown5min.subscribe((time) => {
      if (time) {
        this.countdown = time;
      } else {
        this.countdown = new Date('01/01/2023 00:05:00').getTime();
      }
      this.onCountdown();
    });
  }

  public selectPackage(index: number) {
    this.currentSelect = index;
  }

  public dayToMonth(days: number) {
    return Math.ceil(days / 31);
  }

  public limitNumber() {
    const point = this.pointForm.value;
    const min = 1;
    const max = 100000000;

    if (point >= max) {
      this.pointForm.setValue(max);
    } else if (point <= min) {
      this.pointForm.setValue(min);
    }
  }

  public onPay(state: TBuyState) {
    this.dialogRef.close(state);
  }

  /**
   * Count down the number to zero.
   */
  private onCountdown() {
    const timeout = new Date('01/01/2023 00:00:00').getTime();
    this.isDiscount = true;
    this.$interval = interval(1000) // Emit every second
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        // this.countdown--;
        this.countdown = this.countdown - 1000;
        if (this.countdown === timeout) {
          this.isDiscount = false;
          this.disabledDiscount();
          this.$interval.unsubscribe(); // Stop the interval when countdown reaches zero
        }
      });
  }

  private disabledDiscount() {
    this.promotePackage.forEach((e) => {
      e.price_discount = e.price;
    });
  }

  isBuyPoint(item: TResponsePackage): boolean {
    return item?.point !== 'No Ads';
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$destroy.complete();
    this.$destroy.unsubscribe();
  }
}
