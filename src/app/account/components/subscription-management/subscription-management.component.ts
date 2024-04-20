import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogIHTBComponent } from 'src/app/dialog/components/dialog-ihtb/dialog-ihtb.component';
import { snackbarObj } from 'src/app/dialog/mocks/dialog-mock';
import { SubscriptionPackage } from 'src/app/payment/models/subscription-model';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { language } from 'src/app/shared/change_language/language';
import { Language } from 'src/app/shared/models/shared-model';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DialogPaidV2Component } from 'src/app/dialog/components/dialog-paid-v2/dialog-paid-v2.component';
import { UserData } from 'src/app/auth/models/auth-model';

type TLocale = 'th-TH' | 'en-US'
type TLanguage = {
  TH: TLocale;
  EN: TLocale;
}
@Component({
  selector: 'app-subscription-management',
  templateUrl: './subscription-management.component.html',
  styleUrls: ['./subscription-management.component.scss'],
})
export class SubscriptionManagementComponent implements OnInit {
  public text = language['TH'].userObj.subscription;
  public package = language['TH'].subscriptionObj;
  public rank_text = language['TH'].subscriptionManagementObj;
  currentPackage: SubscriptionPackage = null;
  // ownPackage: SubscriptionPackage[] = null;
  lang: Language = 'TH'
  localeLanguage: TLanguage = {
    TH: 'th-TH',
    EN: 'en-US'
  }

  currentLocale: TLocale = null

  expiredTime = '';
  autoRenewal = '';
  packageColor = {
    Free: '#000000',
    Basic: '#812448',
    Pro: '#222166',
    'Pro plus': '#01BFFB',
    Unlimited: '#01BFFB',
  };
  compensatePackName = '';

  isAutoDebit = true;
  isLoading = false;
  isCompensated = false;
  advantages = null;
  advantagesList = [
    'download',
    'daily_point',
    'monthly_point',
    'play_quota',
    'thb_per_point',
    'workspace',
    'text_limit',
  ];
  month = 1;
  user: UserData = null
  // public get isMember(): boolean {
  //   return (
  //     this.currentPackage.name === 'Free' ||
  //     this.currentPackage.name === 'NoAds'
  //   );
  // }
  // public get buttonLabel(): string {
  //   return this.currentPackage.name === 'Free' ||
  //     this.currentPackage.name === 'NoAds'
  //     ? this.package.tier.disable_text
  //     : this.package.tier.sign_up;
  // }
  // public get isnotFree(): boolean {
  //   return (
  //     this.currentPackage.name === 'NoAds'
  //   );
  // }
  warning = 'ตอนนี้คุณยังไม่มีแพคเกจเสริม'
  constructor(
    private _auth: AuthService,
    private _subscriptionAPI: SubscriptionAPIService,
    private _notify: NotificationService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private snackbar: MatSnackBar,
    private _language: ChangeLanguageService
  ) { }

  onChoose(data: SubscriptionPackage) {
    const js = {
      price: data?.qr_price ? data.qr_price : data.price,
      point: data.name,
      sub_data: data,
    };

    return this.openDialog(js);
  }
  private openDialog(coin: any) {
    this.dialog.open(DialogPaidV2Component, {
      data: coin,
      autoFocus: true,
      disableClose: true,
      width: '400px',
    });
  }

  // TODO benefit of No Ads subscription package change
  ngOnInit(): void {
    this._language.language.subscribe((resp) => {
      if (resp) {
        // Get text language
        this.text = language[resp].userObj.subscription;
        this.package = language[resp].subscriptionObj;
        this.rank_text = language[resp].subscriptionManagementObj;
        // Only currentPackage has value
        // if (this.currentPackage) {
        //   this.getAdvantages(this.text.box2.advantages);
        // }

        this.warning = resp === 'EN' ? 'You currently do not have any add-on packages' : 'ตอนนี้คุณยังไม่มีแพคเกจเสริม'
      }
    });

    this._auth.data.subscribe((res) => {
      if (res) {
        this.user = res
        /* Transform date */
        // this.expiredTime = this.datePipe.transform(
        //   res.exp_subscription,
        //   'dd MMM yyyy H:mm'
        // );
        // this.autoRenewal = this.datePipe.transform(
        //   res.exp_subscription,
        //   'dd MMM yyyy H:mm'
        // );
        // this.isAutoDebit = res.auto_debit;
        // this.month = res.subscription_month ?? 1;

        // // Find compensated user
        // if (res?.keep_sub) {
        //   this.isCompensated = true;
        //   this.compensatePackName = res.keep_sub;
        // }
        // this._subscriptionAPI.$package_addon.subscribe((sub) => {
        //   if (sub) {
        //     /* Find current package in packages */
        //     if (!this.isCompensated) {
        //       this.currentPackage = sub.find(
        //         (e) =>
        //           e?.subscription_rank === String(res?.subscription)
        //           && e.month === this.month
        //       );
        //     } else {
        //       this.currentPackage = sub.find(
        //         (e) => e?.subscription_rank === String(res?.subscription)
        //       );
        //     }
        //     const addonList = res.list_add_on.map(e => e.add_on)

        //     this.ownPackage = sub.filter((e, i) => e.name === addonList[i])
        //   }
        // });
      }
    });
  }

  private onCancel(cancel_now = false) {
    const temp = this.text.cancel_package;
    const ref = this.dialog.open(DialogIHTBComponent, {
      width: '554px',
      height: '395px',
      data: {
        image: 'moneyHand',
        header: temp.title,
        text: temp.content[0] + this.expiredTime + temp.content[1],
        btn: temp.btn,
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res === 'cancel') {
        this.isLoading = true;
        this._subscriptionAPI
          .cancelSubscription(cancel_now)
          .pipe(
            catchError((err) => {
              this.isLoading = false;
              return err;
            })
          )
          .subscribe((res) => {
            this.isLoading = false;
            this.isAutoDebit = false;
            this.snackbar.open(
              this.text.cancel_status,
              '',
              snackbarObj.success
            );
          });
      }
    });
  }
}
