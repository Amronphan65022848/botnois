import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
const { webapi } = environment;
import { DialogService } from '../../services/dialog.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

// PS. This component was create for use once and wait time to remove

interface ResponseData {
  token: string;
  uid: string;
}

@Component({
  selector: 'app-dialog-full-users',
  templateUrl: './dialog-full-users.component.html',
  styleUrls: ['./dialog-full-users.component.scss'],
})
export class DialogFullUsersComponent implements OnInit {
  text = null;
  main_text: string = null;
  bold_text: string = null;

  data!: ResponseData;

  isCredit = false;

  dropdown = ['QR Code & Promptpay', 'Debit & Credit Cards'];
  image = ['promptpay', 'visa-mastercard'];
  paymentMethod = 'QR Code & Promptpay';
  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) data: ResponseData,
    private _dialog: DialogService,
    private clipboard: Clipboard,
    private _language: ChangeLanguageService,
  ) {
    this.data = data;
  }

  ngOnInit(): void {
    this._language.language.subscribe((res) => {
      if (res === 'EN') {
        this.text = {
          header: 'Announcement',
          pay: 'Choose payment method',
          ok: 'OK',
          try: 'try',
          no: 'Reject',
          line: 'Add Line Bot to try it out.',
        };
        this.main_text =
          '\tThe Botnoi Voice team would like to thank you for your interest in trying our website service. Because now the Botnoi Voice website has a lot more users than usual. \n\n\tThis affects the majority of users who have purchased points on the website. For users who have purchased points to use normally, the Botnoi Voice team would like to temporarily stop the free trial service.';
        this.bold_text =
          '\tIf you wish to use the Botnoi Voice website, you can do so by purchasing a package of points, minimum 100 baht (5,400 points) to access during this period.';
      } else {
        this.text = {
          header: 'ประกาศ',
          pay: 'เลือกวิธีชำระเงิน',
          ok: 'ตกลง',
          try: 'ทดลองใช้',
          no: 'ปฏิเสธ',
          line: 'แอดไลน์บอทเพื่อทดลองใช้งาน',
        };
        this.main_text =
          '\tทีมงาน Botnoi Voice ขอขอบคุณที่ท่านสนใจทดลองใช้บริการเว็บไซด์ของเรา เนื่องจากขณะนี้เว็บไซด์ Botnoi Voice มีผู้ใช้งานเป็นจำนวนมากขึ้นจากปกติ \n\n\tทำให้มีผลกระทบกับผู้ใช้งานส่วนใหญ่ที่ได้ทำการซื้อ point กับทางเว็บไซด์ เพื่อผู้ใช้งานที่ได้ทำการซื้อ point ใช้งานได้อย่างปกติ ทางทีมงาน Botnoi Voice จึงขอหยุดให้บริการในส่วนของการทดลองใช้งานที่ไม่มีค่าใช้จ่ายชั่วคราว';
        this.bold_text =
          '\tหากท่านมีความประสงค์ที่จะใช้งานเว็บไซด์ Botnoi Voice สามารถทำได้ด้วยการซื้อแพ็กเกจพ้อยท์ ขั้นต่ำ 100 บาท (5,400 points) เพื่อเข้าใช้งานในช่วงเวลานี้';
      }
    });
  }

  onConfirm() {
    if (this.paymentMethod == 'Debit & Credit Cards') {
      this.isCredit = true;
    }

    this.payForWhitelist(this.data.token).subscribe((res) => {
      document.location.href = res.data;
    });
  }

  onCopy() {
    alert('UID Copied');
    this.clipboard.copy(this.data.uid);
  }

  payForWhitelist(token: string) {
    const header = new HttpHeaders({
      Authorization: token,
    });

    const url = webapi + '/stripe/payment_login?is_credit=' + this.isCredit;
    return this.http.get<any>(url, { headers: header });
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  onTry() {
    const temp = {
      title: this.text.line,
      image: 'https://qr-official.line.me/gs/M_117oiwsv_GW.png',
      width: '250',
      height: '250',
    };
    this._dialog.qr_image(temp);
  }
}
