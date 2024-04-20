import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { language } from 'src/app/shared/change_language/language';
import { HttpResponseBase } from '@angular/common/http';

@Component({
  selector: 'app-coupon-code',
  templateUrl: './coupon-code.component.html',
  styleUrls: ['./coupon-code.component.css'],
})
export class CouponCodeComponent implements OnInit {
  public couponCode: any;
  public isLoading: boolean;
  public message: any;
  public colorMessage: any;

  //#-----------------------------[Change Language]--------------------------------#

  public code_ = 'โค้ด';
  public couponInput = 'ใส่โค้ดที่นี่';
  public access = 'ยืนยัน';
  public redirect = {
    incorrect:
      'ไม่พบโค้ดนี้ โค้ดอาจจะไม่สามารถใช้งานได้แล้วหรือโค้ดที่คุณเพิ่มไม่ถูกต้อง',
    success: 'เติมโค้ดสำเร็จแล้ว',
    alreade_use: 'โค้ดของคุณถูกใช้งานแล้ว',
    expired: 'โค้ดของคุณหมดอายุการใช้งานแล้ว',
    notFillCoupon: 'กรุณาใส่โค้ดของคุณ',
  };

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private walletService: WalletService,
    private auth: AuthService,
    private _changeLanguage: ChangeLanguageService,
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].walletObj.coupon_code;
        this.getdataInfo();
      }
    });
  }
  submitCode() {
    const code = this.couponCode?.trim();

    if (this.couponCode?.length > 0) {
      this.isLoading = true;
      //ส่งข้อมูลไปหา server
      this.walletService.coupon(code.toLocaleLowerCase()).subscribe({
        next: (resp) => {
          this.isLoading = false;
          const res = resp.data;

          if (res.status_coupon == 'success') {
            this.message = this.redirect.success; //"เติมโค้ดสำเร็จแล้ว"
            let profile = this.auth.data.getValue();
            profile.credits = Number(res.sum);

            this.auth.data.next(profile);
            this.colorMessage = 'blue';
          }

          this.message = code + ' ' + this.message;
          this.couponCode = '';
        },
        error: (resp: HttpResponseBase & { error: { message: string } }) => {
          this.isLoading = false;
          const message = resp.error.message;

          if (message == 'incorrect') {
            this.message = this.redirect.incorrect; //"ไม่พบโค้ดนี้ โค้ดอาจจะไม่สามารถใช้งานได้แล้วหรือโค้ดที่คุณเพิ่มไม่ถูกต้อง"
            this.colorMessage = 'red';
          } else if (message == 'already use' || message == 'exceeded use') {
            this.message = this.redirect.alreade_use; //"โค้ดของคุณถูกใช้งานแล้ว"
            this.colorMessage = 'red';
          } else if (message == 'expired') {
            this.message = this.redirect.expired; //"โค้ดของคุณหมดอายุการใช้งานแล้ว"
            this.colorMessage = 'red';
          }
        },
      });
    } else {
      this.message = this.redirect.notFillCoupon; //"กรุณาใส่โค้ดของคุณ"
    }
  }

  text = null;

  getdataInfo() {
    this.code_ = this.text.code_;
    this.couponInput = this.text.couponInput;
    this.access = this.text.access;
    this.redirect = this.text.redirect;
  }
}
