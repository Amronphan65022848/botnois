import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogPaidV2Component } from 'src/app/dialog/components/dialog-paid-v2/dialog-paid-v2.component';
import { SubscriptionComponent } from 'src/app/payment/components/subscription/subscription.component';
import { SubscriptionPackage, TAddonPackage } from 'src/app/payment/models/subscription-model';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { language } from 'src/app/shared/change_language/language';
import { Language, TBuyState } from 'src/app/shared/models/shared-model';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-text-exceed-limit-dialog',
  templateUrl: './text-exceed-limit-dialog.component.html',
  styleUrls: ['./text-exceed-limit-dialog.component.scss'],
})
export class TextExceedLimitDialogComponent implements OnInit {
  public text = language['TH'].text2speechObj.conver_mode.alert[1];
  public textLimit = null;
  promotionPackage: TAddonPackage = null
  lang: Language

  get isMember(): boolean {
    return this.textLimit > 1000
  }
  constructor(
    private dialogRef: MatDialogRef<TextExceedLimitDialogComponent>,
    private _changeLanguage: ChangeLanguageService,
    private router: Router,
    private _subAPI: SubscriptionAPIService,
    public _wallet: WalletService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) {
    this.textLimit = data
  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.lang = res
        this.text = language[res].text2speechObj.conver_mode.alert[1];
      }
    });

    this._subAPI.$package_addon
      .subscribe(
        res => {
          this.promotionPackage = res.find(e => e.name === 'Limit_text')
        }
      )
  }

  onCancel() {
    this.dialogRef.close();
  }

  public onPay(item: TAddonPackage) {
    this.dialog.open(DialogPaidV2Component, {
      data: this.formatData(item),
      autoFocus: true,
      disableClose: true,
      width: '400px',
    });
    this.dialogRef.close(true)

  }

  formatData(data: TAddonPackage) {
    return {
      price: data?.qr_price ? data.qr_price : data.price,
      point: data.display_name,
      sub_data: data,
    };
  }

  onConfirm() {
    this.router.navigate(['/payment']);
    this.dialogRef.close();
  }
}
