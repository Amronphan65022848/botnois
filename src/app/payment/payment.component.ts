import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { GlobalFunctionService } from '../shared/services/global-function.service';
import { DialogService } from '../dialog/services/dialog.service';
import { language } from '../shared/change_language/language';
import { PaymentFlexComponent } from './dialog/payment-flex/payment-flex.component';
import { Subscription } from './models/subscription-model';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { ChangeNavbarData } from './models/wallet-model';
import { UserData } from '../auth/models/auth-model';
import { ScreenSizeService } from '../shared/services/screen-size.service';
import { AdsService } from '../voice/services/ads.service';
import { analyticId } from '../shared/mocks/analyticId-mock';
import { TitleMetaService } from '../shared/services/title-meta.service';

type TAfterPaid = {
  sub_add?: 'success';
  payment_status?: 'success';
  subscription_status?: 'success';
}

type TPages = {
  page?: number;
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  promotion_show: boolean = true;
  valueWrong: boolean = false;
  coinsPayment: any[] = [];
  couponCode: any;
  pointNeed: number;
  credits: any = 0;
  showPackage: string = null;

  currentPackagePrice = 0;
  userCurrentPackage = 0;
  user: UserData;
  isLoadPackage: any = false;
  pointLoading: boolean = false;
  subject_point = new Subject();
  inputPointForm = new FormGroup<any>({
    point: new FormControl(null, [Validators.min(0), Validators.required]),
    baht: new FormControl(0),
  });
  text = language['TH'].walletObj;
  lang = null;
  category = 0 // Default 0;

  isTablet: boolean = false;
  analyticId = analyticId.payment.paymentModule
  public isPageHidden: boolean;
  public pageVisitCount: number = 0;

  @ViewChild('subscriptionComponentRef')
  subscriptionComponent: SubscriptionComponent;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth > 800) {
      this.isTablet = false;
    } else {
      this.isTablet = true;
    }
    // Add your logic here
  }

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public _auth: AuthService,
    private route: ActivatedRoute,
    private _changeLanguage: ChangeLanguageService,
    private _gfunc: GlobalFunctionService,
    private _dialog: DialogService,
    private _screen: ScreenSizeService,
    private _ads: AdsService,
    private meta: TitleMetaService,
  ) {

    this.route.queryParams.subscribe((path: TAfterPaid & TPages) => {
      if (path.page) {
        this.changeNav(Number(path.page));
      }

      if (path.payment_status || path.subscription_status) {
        // Reset ads
        this._ads.resetMax()
      }

      /* Stripe payment top-up status */
      if (path.payment_status) {
        // this._dialog.success('Top-up complete');

        setTimeout(() => {
          this.dialog.open(PaymentFlexComponent, {
            width: '556px',
            height: '355px',
            data: {
              icon: 'check_circle_filled',
              text: this.text.alert.alert_success_point,
            },
          });
          if (path.sub_add) {

            router.navigate(['/account'], { queryParams: { page: 1 } })

          }

        }, 500);

        this._gfunc.clearQueryParams(); // Clear query params

      }

      /* Subscription status */
      if (path.subscription_status) {

        setTimeout(() => {
          const ref = this.dialog.open(PaymentFlexComponent, {
            width: '556px',
            height: '355px',
            data: {
              icon: 'check_circle_filled',
              text: this.text.alert.alert_success_package,
            },
          });
          ref
            .afterClosed()
            .subscribe(() =>
              router.navigate(['/account'], { queryParams: { page: 1 } })
            );
        }, 500);

        this._gfunc.clearQueryParams(); // Clear query params
      }

      /* Disabled because user can not back to previous page */
      // this._gfunc.clearQueryParams() // Clear query params
    });
  }

  ngOnInit(): void {
    this._gfunc.changeBackgroundColor('#F7F8FA');

    const screen = this._screen.getSize();
    if (screen.width < 800) {
      this.isTablet = true;
    }

    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].walletObj;
        this.lang = res;
      }
    });

    this._auth.data.subscribe((res) => {
      if (res) {
        this.credits = res.credits;
        // Get current package, If user have compensated will pul keep_sub instead

        this.user = res;
        this.showPackage = res['compensate_sub']
          ? res.keep_sub
          : res.subscription;
      }
    });
  }

  ngAfterViewInit(): void {

    // Scroll to the view
    setTimeout(() => {
      document.getElementById('here').scrollIntoView({ behavior: 'smooth' })
    }, 500);
  }


  getCurrentPackagePrice(price: number) {
    this.currentPackagePrice = price;
  }

  /** Navigate user to invoice tax site */
  toTaxInvoice() {
    const url =
      'https://docs.google.com/document/d/1v2lmehMG6Jie8WrbnfGCf4Wa-odwN26VxATnwm4_qT4/edit?usp=sharing';
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    this._gfunc.changeBackgroundColor();
  }

  changeNav(page: number) {
    this.category = page;
    // const title = this.text.navigate[page]
    // this.meta.setTitle(title)
    // Scroll to an element with smooth animation

    // this.router.navigate(['/payment'], { queryParams: { page: page } });
  }

  changeNavAndPage(data: ChangeNavbarData) {
    this.category = data.page;
    setTimeout(() => {
      // this.subscriptionComponent.setMonth(data.month);
      // if(data.action === 'subscription') {
      //   const temp = {
      //     price: res.$package.price,
      //     point: res.$package.subscription_rank,
      //     sub_data: res.package,
      //   };

      //   this.dialog.open(DialogPaidV2Component, {
      //     data: temp,
      //     autoFocus: true,
      //     disableClose: true,
      //   });
      // }
    }, 0);
  }
}
