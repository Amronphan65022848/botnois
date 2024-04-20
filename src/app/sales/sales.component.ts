import { Component, OnInit } from '@angular/core';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { SalesApiService } from './services/sales-api.service';
import {
  SalesObj,
  TablePaymentInMonth,
  TransactionInMonth,
  ViewPanelType,
} from './models/sales-model';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '../shared/services/notification.service';
import { Language } from '../shared/models/shared-model';
import { language } from '../shared/change_language/language';
import { salesObj } from './mocks/sales-mock';
import { FormControl } from '@angular/forms';
import { DialogService } from '../dialog/services/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FlexDialogComponent } from '../shared/dialogs/flex-dialog/flex-dialog.component';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  //#-----------------------------[Change Language]--------------------------------#

  public month = new FormControl('มกราคม');
  public monthsArrayTH = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกภาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤษจิกายน',
    'ธันวาคม',
  ];
  public monthsArrayENG = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public monthsArray = this.monthsArrayTH;
  public customerList = ['รายชื่อลูกค้า', 'ประจำเดือน'];

  language = language;
  text = null;
  dialogText: any = null;
  data: SalesObj = salesObj;
  isLoading = false;
  isDelay = false;

  viewPanelStyleObj = {
    current: 'list',
    list: {
      color: '#01BFFB',
      background: '#EFFBFE',
    },
    total: {
      color: '#B7BBC0',
      background: '#FFFFFF',
    },
  };

  constructor(
    public _gfunc: GlobalFunctionService,
    private _changeLanguage: ChangeLanguageService,
    private _salesApi: SalesApiService,
    private _notify: NotificationService,
    private clipboard: Clipboard,
    private _dialog: DialogService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangeLanguage(res);
        const { month, year } = this._gfunc.getCurrentDate();
        this.data.date = { month: String(month), year: String(year) };
        this.monthsArray =
          res === 'EN' ? this.monthsArrayENG : this.monthsArrayTH;
        this.month.patchValue(this.monthsArray[month - 1]);
        this.data.rangeInMonth = this._gfunc.getRangeInMonth(month, year);
      }
    });
    /* Get sales data by fetching API */
    this.getSalesData();

    /* Get month selected on mat-select dropdown */
    this.month.valueChanges.subscribe((res) => {
      const path = this._gfunc.getUrlPath();
      if (typeof res === 'string' && path === 'sales') {
        const index = this.monthsArray.findIndex((e) => e === res);
        this.data.date.month = String(index + 1);
        this.getSalesData();
      }
    });

    this._notify.notifyJson.subscribe((res) => {
      if (res) {
        this.data.withdraw_limit = res.sales.withdraw_limit;
      }
    });

    this.getDelayTime();
  }

  ngOnDestroy(): void {
    this._gfunc.changeBackgroundColor();
  }

  getSalesData() {
    this.isLoading = true;

    this._salesApi.getSalesData(this.data.date).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 403) {
          this._dialog.warning(res.message);
          setTimeout(() => {
            this.router.navigate(['/tts']);
          }, 1000);
        } else {
          this.data.salesData = res.data;
          this.data.salesDataTotal = this.sumTransactions(
            this.data?.salesData?.table_payment_in_month?.transaction
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  getDelayTime() {
    setTimeout(() => {
      this.isDelay = true;
    }, 5000);
  }

  sumTransactions(items: TransactionInMonth[]) {
    // Create an empty JSON object to store the results
    let results: any[] = [];
    let duplicate = 0;

    // Iterate through the list of dictionaries
    for (const item of items) {
      /* Find username in results */
      const filterd = results.filter((e) => e.username === item.username)[0];

      if (item.username === filterd?.username) {
        results[duplicate - 1] = this.mergeObjects(
          results[duplicate - 1],
          item
        );
      } else {
        results.push(item);
        duplicate++;
      }
    }
    // Assign the results object back to the original list of dictionaries
    items = results as any;

    // Return the original list of dictionaries with the updated prices
    return items;
  }

  /** Merge between 2 objects */
  mergeObjects(obj1: TransactionInMonth, obj2: TransactionInMonth) {
    // Create a new object with the properties of both input objects
    const result: TransactionInMonth = { ...obj1, ...obj2 };

    // Declare constant variable array
    const number = ['income', 'share'];

    // Iterate through the keys of the result object
    for (const key of Object.keys(result)) {
      // Check if the key exists in both input objects
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        // If the key exists in array, sum the values
        if (number.includes(key)) {
          result[key] = String(Number(obj1[key]) + Number(obj2[key]));
        }
      }
    }

    // Return the result
    return result;
  }

  withdrawButton() {
    const dialogRef = this.dialog.open(FlexDialogComponent, {
      data: {
        text: this.dialogText[2],
        icon: 'moneyHand',
        icon_color: '',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.isLoading = true;
        this._salesApi.fetchWithdraw().subscribe((res) => {
          if (res.message == 'you already request withdraw.') {
            this.data.alreadyWithdraw = 1;
          }
          this.data.messageShow = true;
          this.isLoading = false;
        });
      } else {
        return;
      }
    });
  }

  openAlert() {
    this.data.clickDelete = true;
  }

  closeAlert() {
    this.data.clickDelete = false;
  }

  submitRemove() {
    this.data.clickDelete = false;
    this.displayFloating(this.text.redirect.copyComplete);
  }

  async displayFloating(message: string) {
    this.data.floatingMessage.push(message);
    this.data.messangeFloating = true;
    setTimeout(() => {
      this.data.floatingMessage.splice(0, 1);
      if (this.data.floatingMessage.length <= 0)
        this.data.messangeFloating = false;
    }, 4000);
  }

  get_dataChangeLanguage(temp: Language) {
    this.text = this.language[temp].salesObj;
    this.dialogText = this.language[temp].popupObj;
  }

  onCopy() {
    this.displayFloating(this.text.successCopy + ' !');
    this.clipboard.copy(this.data.salesData.sale_code_name);
  }

  onImageError() {
    return '../../../assets/icons/default_picture.svg';
  }

  onClickViewPanel(view: ViewPanelType) {
    /* Check current view if duplicate will not do anything */
    if (this.viewPanelStyleObj.current == view) return;

    /* Get keys and assign to array */
    const keys = Object.keys(this.viewPanelStyleObj);

    /* Remove key by view variable */
    const filterdArray = keys.filter((e) => e !== view && e !== 'current')[0];

    /* Save data in temp before swap data */
    const temp = this.viewPanelStyleObj[filterdArray];

    /* Swap data */
    this.viewPanelStyleObj.current = view;
    this.viewPanelStyleObj[filterdArray] = this.viewPanelStyleObj[view];
    this.viewPanelStyleObj[view] = temp;
  }
}
