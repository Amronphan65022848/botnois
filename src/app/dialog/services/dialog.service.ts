import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2';

import { DialogSuccessComponent } from '../components/dialog-success/dialog-success.component';
import { DialogImage } from '../../model/core-model';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  // public problemTryagain = "เกิดข้อผิดพลาด โปรดลองอีกครั้ง";
  // public recordNotsup = "ระบบอัดเสียงไม่รองรับระบบปฏิบัติการ";
  // public welcomeword = "ยินดีต้อนรับสู่ Botnoi Voice";
  // public receive = "คุณได้รับ 2,500 PT";
  // public usedCode = "คุณได้ทำการใช้โค้ดไปแล้ว";
  // public inviteCodeerr = "โค้ดเชิญเพื่อนสามารถใช้ได้เพียงครั้งเดียวต่อหนึ่งแอคเคาท์";
  // public codeerr = "ไม่สามารถใช้งานโค้ดได้";
  // public inviteCodeself = "คุณไม่สามารถใช้โค้ดนี้เชิญตัวคุณเองได้";
  // public agree_ = "ตกลง";

  text = TH.dialogServiceObj;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _changelanguage: ChangeLanguageService
  ) {}

  error(text: string) {
    Swal.fire({
      title: 'Error!',
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    });
  }

  errorResult(text: string) {
    return Swal.fire({
      title: 'Error!',
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  errorRedirect(text: string, confirmButtonText: string) {
    return Swal.fire({
      title: 'Error!',
      text: text,
      icon: 'error',
      confirmButtonText: confirmButtonText,
    });
  }

  image(body: DialogImage) {
    Swal.fire({
      title: body.title,
      text: body.text,
      imageUrl: body.image,
      imageWidth: body.width,
      imageHeight: body.height,
      confirmButtonText: body.confirmButtonText,
      confirmButtonColor: '#01BFFB',
    });
  }

  qr_image(body: any) {
    Swal.fire({
      title: body.title,
      imageUrl: body.image,
      imageWidth: body.width,
      imageHeight: body.height,
      showConfirmButton: false,
      showCloseButton: true,
      imageAlt: 'QR Code Image',
    });
  }

  success(text: string) {
    Swal.fire({
      title: 'Success!',
      text: text,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  somethingWentWrong() {
    Swal.fire({
      title: 'Error!',
      text: this.text.problemTryagain,
      icon: 'error',
      confirmButtonText: this.text.agree_,
    });
  }

  microphoneNotSupportIOS() {
    Swal.fire({
      title: 'Warning!',
      text: this.text.recordNotsup + ' IOS',
      icon: 'warning',
      confirmButtonText: this.text.agree_,
    });
  }

  info(text: string) {
    Swal.fire({
      title: 'Info!',
      text: text,
      icon: 'info',
      confirmButtonText: this.text.agree_,
    });
  }

  warning(text: string) {
    Swal.fire({
      title: 'Warning!',
      text: text,
      icon: 'warning',
      confirmButtonText: this.text.agree_,
    });
  }

  saleCodeWorng(text: string) {
    Swal.fire({
      title: 'Error!',
      text: text,
      icon: 'error',
      confirmButtonText: this.text.agree_,
    });
  }

  invitedSuccess() {
    Swal.fire({
      title: this.text.welcomeword,
      text: this.text.receive,
      icon: 'success',
      confirmButtonText: this.text.agree_,
    });
  }

  usedAlready() {
    Swal.fire({
      title: this.text.usedCode,
      text: this.text.inviteCodeerr,
      icon: 'info',
      confirmButtonText: this.text.agree_,
    });
  }

  infoCode(text: string) {
    Swal.fire({
      title: this.text.codeerr,
      text: text,
      icon: 'info',
      confirmButtonText: this.text.agree_,
    });
  }

  selfCode() {
    Swal.fire({
      title: this.text.codeerr,
      text: this.text.inviteCodeself,
      icon: 'error',
      confirmButtonText: this.text.agree_,
    });
  }

  openDialogSuccess(sum: String) {
    const dialogsuccess = this.dialog.open(DialogSuccessComponent, {
      data: sum,
      autoFocus: false,
      panelClass: 'full-width-dialog',
    });
    dialogsuccess.afterClosed().subscribe((result) => {
      if (result == true) {
        this.router.navigate(['/text2speech']);
      }
    });
  }

  warningWithNavigate(title: string, text: string, btn: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: btn,
    }).then((res) => {
      if (res.isConfirmed) {
        /* Navigate user to subscription page on account module */
        this.router.navigate(['account'], { queryParams: { page: 1 } });
      }
    });
  }

  asking(data: any) {
    return Swal.fire({
      title: data.title,
      text: data.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: data.yes,
      cancelButtonText: data.no,
    });
  }

  input_number(data: any) {
    return Swal.fire({
      title: data.title,
      input: 'number',
      inputLabel: data.label,
      inputPlaceholder: data.placeholder,
      confirmButtonText: data.btn,
      showCloseButton: true,
      padding: '12px 24px',
    });
  }
}
